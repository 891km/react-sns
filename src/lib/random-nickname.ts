// 랜덤 닉네임 생성
export const getRandomNickname = () => {
  const adverbs = [
    "조용히",
    "빠르게",
    "행복하게",
    "용감하게",
    "재미있게",
    "빛나게",
    "얌전하게",
    "친절하게",
    "은은하게",
    "",
  ];

  const adjectives = [
    "행복한",
    "용감한",
    "똑똑한",
    "친절한",
    "차분한",
    "현명한",
    "빠른",
    "밝은",
    "상냥한",
    "대담한",
    "귀여운",
    "멋진",
    "유쾌한",
    "활발한",
    "조용한",
    "열정적인",
    "창의적인",
    "재미있는",
    "진지한",
    "낙천적인",
  ];

  const adverb = adverbs[Math.floor(Math.random() * adverbs.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  return `${adverb}${adjective}두더지`;
};
