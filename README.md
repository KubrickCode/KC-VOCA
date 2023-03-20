# KC-VOCA
KC VOCA APP

이 프로젝트는 사용자들이 외국어 단어나 표현(혹은 외우고 싶은 어떠한 것)을 배우고 연습하는 것을 돕는 웹 애플리케이션인 어휘 프로젝트 입니다. 이 프로젝트는 프론트 엔드에 React, 개발 환경에 Vite, 백엔드 서버에 Express, 데이터베이스로 MySQL을 사용합니다.

회원 인증 구현으로는 passport-local, passport-google-oauth2, passport-kakao 를 사용하여, 로컬회원, 구글로그인, 카카오로그인 등을 구현하였습니다.
그리고 AWS의 IAM 자격증명으로 API를 사용하여, AWS Polly로 TTS 서비스를 구현하고, AWS SES를 통해 메일 서비스를 구현하였습니다.


## 컨텐츠 목록

1. [시작하기](#시작하기)
    - [필수요건](#필수요건)
    - [설치](#설치)
2. [사용법](#사용법)
3. [프로젝트 참여](#프로젝트-참여)
4. [저작권](#저작권)
5. [연락 정보](#연락-정보)

## 시작하기

로컬 복사본을 설치 및 실행하려면 다음과 같은 간단한 단계를 수행하세요.

### 필수요건

이 프로젝트를 수행하려면 Node.js 및 npm이 시스템에 설치되어 있어야 합니다. Node.js는 [here](https://nodejs.org/)에서 다운로드할 수 있으며 npm이 함께 제공됩니다.

### 설치

1. 저장소 Clone 혹은 Download Zip

2. 프로젝트 폴더로 이동

3. 프로젝트 폴더에서 npm install, 그리고 client 폴더에서 npm install을 각각 실행하여 종속성 설치.

4. 프로젝트의 루트 디렉터리에 .env 파일을 생성하고 환경 변수를 구성하세요. 다음 형식을 참조로 사용합니다
```
DB_host = 데이터베이스 엔드포인트
DB_user = 데이터베이스 유저
DB_password = 데이터베이스 비밀번호
DB_port = 데이터베이스 포트(일반적으로 3306)
DB_database = 기본 데이터베이스
DB_dateStrings = date
SESSION_SECRET = 세션 암호
ACCESSKEYID = AWS IAM 액세스 아이디
SECRETACCESSKEY = AWS IAM 시크릿 액세스키
SIGNATUREVERSION = v4
REGION = us-east-1
K_REGION = ap-northeast-2
GOOGLE_ID = 구글 로그인 API ID
GOOGLE_SECRET = 구글 로그인 API 암호
GOOGLE_CALLBACK = http://localhost:3000/api/signpage/google/callback (배포 시에는 내 도메인/api/signpage/google/callback)
KAKAO_ID = 카카오 로그인 API ID
KAKAO_CALLBACK = http://localhost:3000/api/signpage/kakao/callback (배포 시에는 내 도메인/api/signpage/kakao/callback)
MAIL = 메일서비스에서 이용하는 내 메일
MAILPWD = 메일서비스 암호
CORS_LINK = http://localhost:5173
REDIRECT_ROOT = http://localhost:5173 (배포 시에는 /)
```
client 폴더 내에도 .env 파일을 생성하고 다음과 같이 작성합니다
```
VITE_SERVER_HOST = http://localhost:3000/api (배포 시에는 /api)
```
5. npm run dev 시, localhost:3000에 백엔드 서버, localhost:5173에 클라이언트 서버가 동시에 실행됩니다.

## 사용법

브라우저에서 응용프로그램을 오픈한 뒤, 회원가입 혹은 Google,KaKao 로그인을 진행합니다.

폴더,단어장,데이터 등을 저장할 수 있습니다. 추가,수정,삭제 모두 가능하고, 회원정보에 대한 수정 또한 가능합니다.

UI가 직관적인 편이기에, 상세한 설명 없이도 무리없이 파악하고 이용 가능합니다.

즐겨찾기, 회원들과 공유하는 기능, 다크모드 등이 가능합니다.

## 프로젝트 참여

프로젝트 참여를 환영합니다! 기여하려면 다음 단계를 수행하세요:

1. 프로젝트를 Fork하세요.
2. 자신만의 branch를 만드세요 (`git checkout -b feature/YourFeature`)
3. 변경 사항을 커밋하세요 (`git commit -m 'Add YourFeature'`)
4. branch를 push하세요 (`git push origin feature/YourFeature`)
5. Pull Requests를 오픈하세요.

## 저작권

MIT 라이선스에 따라 배포됩니다. 자세한 내용은 '라이센스'를 참조하십시오.

## 연락 정보

kubrick code - kubrickcode@gmail.com

Project Link: https://github.com/kubrickcode/KC-VOCA
