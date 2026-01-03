import ProfileAvatar from "@/components/profile/profile-avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { TOAST_MESSAGES_PROFILE } from "@/constants/toast-messages";
import { userUpdateProfile } from "@/hooks/mutations/profile/use-update-profile";
import { cn } from "@/lib/utils";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useProfileEditorModal } from "@/store/profile-editor-modal";
import { useSessionProfile, useSessionUserId } from "@/store/session";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

type ImageItem = {
  file: File;
  previewUrl: string;
};

export default function ProfileEditorModal() {
  const openAlertModal = useOpenAlertModal();
  const userId = useSessionUserId();
  const profile = useSessionProfile();
  const store = useProfileEditorModal();
  const {
    isOpen,
    actions: { close },
  } = store;

  const { mutate: updateProfile, isPending: isUpdatePending } =
    userUpdateProfile({
      onSuccess: () => {
        close();
        toast.info(TOAST_MESSAGES_PROFILE.UPDATE.SUCCESS);
      },
      onError: () => {
        toast.error(TOAST_MESSAGES_PROFILE.UPDATE.ERROR);
      },
    });

  //  - state & ref
  const [avatarItem, setAvatarItem] = useState<ImageItem | null>(null);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- useEffect
  useEffect(() => {
    if (isOpen && profile) {
      setNickname(profile.nickname);
      setBio(profile?.bio || "");
      setAvatarItem(null);
    }
  }, [profile, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (avatarItem) {
        resetAvatarItem();
      }
    }
  }, [isOpen]);

  // --- event handler
  const handleEditAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    resetAvatarItem();
    setAvatarItem({
      file,
      previewUrl: URL.createObjectURL(file),
    });

    e.target.value = "";
  };

  const handleDeleteAvatarClick = () => {
    resetAvatarItem();
  };

  const handleEditProfileClick = () => {
    if (isBlocked) {
      toast.info(`닉네임은 최소 ${NICKNAME_LENGTH_MIN}자 이상 입력해 주세요.`);
      return;
    }

    updateProfile({
      userId: userId!,
      nickname,
      bio,
      avatarImageFile: avatarItem?.file,
    });
  };

  const handleCloseModal = () => {
    if (isChanged) {
      openAlertModal({
        title: "프로필 수정이 마무리 되지 않았습니다",
        description: "이 화면에서 나가면 수정 중인 내용이 사라집니다.",
        onAction: () => {
          close();
        },
      });
      return;
    }
    close();
  };

  // -- function
  function resetAvatarItem() {
    if (!avatarItem) return;
    URL.revokeObjectURL(avatarItem.previewUrl);
    setAvatarItem(null);
  }

  // --- variables
  const isNicknameChanged = profile?.nickname !== nickname;
  const isBioChanged = profile?.bio !== bio;
  const isAvatarChanged = Boolean(avatarItem);
  const isChanged = isNicknameChanged || isBioChanged || isAvatarChanged;
  const NICKNAME_LENGTH_MIN = 2;
  const isBlocked = nickname.length < NICKNAME_LENGTH_MIN;

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="flex max-h-[90vh] min-h-80 flex-col">
        <DialogHeader className="gap-8">
          <DialogTitle className="sm:text-center">프로필 수정</DialogTitle>
          <DialogDescription className="sr-only">
            프로필 정보를 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex w-full flex-col gap-10 py-2 pb-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="avatar" className="flex flex-col items-start">
                <span>프로필 이미지</span>
              </Label>
              <input
                ref={fileInputRef}
                id="avatar"
                type="file"
                accept="image/*"
                className="pointer-events-none hidden"
                onChange={(e) => handleSelectImage(e)}
                disabled={isUpdatePending}
              />
              <div className="relative mx-auto w-fit">
                <ProfileAvatar
                  src={avatarItem?.previewUrl || profile?.avatarImageUrl}
                  size={30}
                />
                <Button
                  variant="default"
                  size="icon-lg"
                  className="bg-primary/70 hover:bg-primary/80 absolute right-0 bottom-0 rounded-full"
                  aria-label="프로필 이미지 편집"
                  onClick={
                    isAvatarChanged
                      ? handleDeleteAvatarClick
                      : handleEditAvatarClick
                  }
                  disabled={isUpdatePending}
                >
                  {isAvatarChanged ? (
                    <Trash2Icon className="[svg]:h-8 [svg]:w-8" />
                  ) : (
                    <PencilIcon className="[svg]:h-8 [svg]:w-8" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="flex flex-col items-start">
                <span>닉네임</span>
                <Input
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={cn(
                    "h-12 w-full text-sm md:text-base",
                    !isNicknameChanged && "text-muted-foreground",
                  )}
                />
              </Label>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="flex flex-col items-start">
                <span>자기소개</span>
                <Input
                  placeholder="자기소개를 입력하세요"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={cn(
                    "h-12 w-full text-sm md:text-base",
                    !isBioChanged && "text-muted-foreground",
                  )}
                />
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleEditProfileClick}
            disabled={isUpdatePending || !isChanged}
          >
            {isUpdatePending && <Spinner />}수정하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
