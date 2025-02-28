# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# 네트워크 대시보드

## 개요
네트워크 대시보드는 서버들의 네트워크 상태를 실시간으로 모니터링하고 다양한 통계를 제공하는 웹 애플리케이션입니다. 사용자는 메인 페이지에서 전체 서버 상태를 한눈에 파악할 수 있으며, 개별 서버의 상세 정보 및 기간별 통계를 조회할 수 있습니다. 또한, OpenAI 기반의 챗봇을 활용하여 네트워크 및 서버 관련 질문을 할 수 있습니다.

## 주요 기능
### 실시간 서버 상태 확인
- 메모리, Swap 메모리, CPU, 디스크 사용량 (%)
- 서버 응답 속도 표시

### 서버 상세 정보 제공
- 네트워크 전송 속도 (bps)
- 포트 사용량
- 접속 중인 유저 수
- 기간별 통계 확인

### 추가 기능
- 전체 서버 통계 페이지 제공
- OpenAI 기반 챗봇을 통한 네트워크 및 서버 관련 질문 지원

## 기술 스택
- **프론트엔드**: React, TypeScript, D3.js
- **백엔드 (필요 시 추가)**: Express, Node.js
- **기타**: Chart.js (통계 시각화), OpenAI API (챗봇)

## 설치 및 실행 방법
### 1. 프로젝트 클론
```sh
git clone https://github.com/your-repo/network-dashboard.git
cd network-dashboard
```

### 2. 패키지 설치
```sh
yarn install  # 또는 npm install
```

### 3. 개발 서버 실행
```sh
yarn start  # 또는 npm start
```

## 사용 방법
1. 메인 페이지에서 전체 서버 상태를 확인합니다.
2. 특정 서버를 클릭하여 상세 정보를 조회합니다.
3. 기간별 통계를 확인하고 분석합니다.
4. 챗봇을 활용하여 네트워크 및 서버 관련 질문을 합니다.

## 기여 방법
1. 이슈를 생성하여 버그 또는 기능 요청을 제안합니다.
2. 프로젝트를 포크한 후 새로운 브랜치를 생성합니다.
3. 기능을 추가하거나 버그를 수정한 후 PR을 제출합니다.

## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.


