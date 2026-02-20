# Hero In The Forest 🌲⚔️

**Hero In The Forest**는 HTML5 Canvas와 Vanilla JavaScript로 제작된 2D 횡스크롤 액션 플랫포머 웹 게임입니다. 빠른 호흡의 액션과 단순하면서도 중독성 있는 성장의 재미를 담고 있습니다.

## 🌟 주요 특징 (Features)

*   **반응형 캔버스 지원:** 브라우저 크기를 조절해도 픽셀이 깨지지 않고 꽉 차게 렌더링 됩니다.
*   **파밍 전투 시스템:** 멧돼지 등 필드 몬스터사냥 시 확률적으로 **코인**을 드롭합니다. 물리 엔진이 적용되어 바닥에 통통 튀어 흩어집니다!
*   **자원 채굴 모드:** 맵 구석구석 배치된 광맥 타일을 공격하여 파괴하면 희귀한 **자원**을 추가로 수급할 수 있습니다.
*   **조합대(Crafting) & 가챠(Gacha):** 
    *   모은 자원과 코인을 이용해 조합대에 다가가면 새로운 무기를 랜덤한 확률(Rusty, Iron, Steel, Mithril, Legendary)로 획득할 수 있습니다.
*   **무기 합성(Synthesis):** 
    *   획득한 무기를 인벤토리 탭에서 합성/강화(+1, +2...)하여 더 강한 데미지로 업그레이드할 수 있습니다!

## 🎮 조작 방법 (Controls)

*   `A`, `D` 또는 `←`, `→` : 좌우 이동
*   `W`, `Space`, `↑` : 점프
*   `F`, `Z`, `Enter` : 무기 공격 및 자원 파괴
*   `E` : 조합대 근처에서 크래프팅 메뉴 열기/닫기

## 🚀 설치 및 실행 방법 (Getting Started)

이 프로젝트는 빠르고 가벼운 프론트엔드 빌드 툴인 [Vite](https://vitejs.dev/)를 사용합니다.

### 요구 사항
* [Node.js](https://nodejs.org/) 설치

### 로컬 실행 
1. 레포지토리를 클론합니다.
```bash
git clone https://github.com/SkyAicoding/hero-in-the-forest.git
cd hero-in-the-forest
```
2. 의존성 패키지를 설치합니다.
```bash
npm install
```
3. 로컬 개발 서버를 실행합니다.
```bash
npm run dev
```
4. 터미널에 표시된 `http://localhost:5173` 링크를 브라우저로 열어 게임을 즐기세요!

## 🎨 에셋 및 사용 기술
*   **Art Assets:** `Legacy-Fantasy - High Forest 2.3` 에셋 팩 활용.
*   **Tech Stack:** HTML5 캔버스 API, Vanilla JS, CSS3, Vite.
