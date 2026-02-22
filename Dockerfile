FROM node:22-alpine

WORKDIR /app

# 패키지 파일만 먼저 복사하여 레이어 캐싱 활용
COPY web/package*.json ./

RUN npm install

# 소스 코드는 볼륨 마운트로 처리 (개발 환경)
EXPOSE 3000

CMD ["npm", "run", "dev"]
