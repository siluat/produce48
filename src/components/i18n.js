import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'kr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    },
    resources: {
      kr: {
        translation: {
          'top-menu-garden': '국프의 정원 후원 현황',
          'top-menu-concept': '콘셉트 평가 순위',
          'top-menu-concept-trainee': '콘셉트 평가 개별 순위',
          'top-menu-concept-music': '콘셉트 평가 곡별 순위',
          'top-menu-special-clip': '48 스페셜 영상 순위',
          'top-menu-position': '포지션 평가 순위',
          'top-menu-group': '그룹 배틀 평가 순위',
          'top-menu-nekkoya': '내꺼야 직캠 순위',
          'garden-title': '국프의 정원 후원 현황',
          'garden-step-view': '단계현황',
          'garden-video-view': '인증영상',
          'garden-timestamp-view': '달성일',
          'garden-days-view': '달성기간',
          'garden-step': '{{value}}단계',
          'garden-day': '일',
          'garden-rising-today': '오늘 상승!',
          'special-title': '프로듀스 48 스페셜 영상 항목별 순위',
          'position-title': '프로듀스 48 포지션 평가 항목별 순위',
          'group-title': '프로듀스 48 그룹 배틀 평가 항목별 순위',
          'nekkoya-title': '프로듀스 48 내꺼야 직캠 항목별 순위',
          'clip-heart': '하트',
          'clip-nc-heart': '네캐하트',
          'clip-twitter-heart': '트위터하트',
          'clip-play': '재생',
          'clip-comment': '댓글',
          'direct-cam-heart': '직캠하트',
          'direct-cam-play': '직캠재생',
          'direct-cam-comment': '직캠댓글',
          'offline-vote': '현장투표',
          'be-updated-every-midnight': '매일 자정에 업데이트됩니다.',
          'be-updated-every-five-minutes': '5분마다 최신 정보로 업데이트됩니다.',
          'placeholder-name': '이름',
          'weekly-rank-chart': '주차별 투표 순위 변동',
          'week': '주차',
          'rank': '위',
          'preparing': '준비중',
          'invalid-url': '잘못된 주소로 접근하셨습니다.',
          'use-menu-on-top': '상단 메뉴를 통해 정상 페이지를 이용해주세요.',
          'vote-your-girl': '당신의 소녀에게 투표하세요.',
        }
      },
      jp: {
        translation: {
          'top-menu-garden': '国プの庭園の応援状況',
          'top-menu-concept': 'コンセプト評価順位',
          'top-menu-concept-trainee': 'コンセプト評価曲別順位',
          'top-menu-concept-music': 'コンセプト評価個人順位',
          'top-menu-special-clip': '48 스페셜 영상 순위',
          'top-menu-position': 'ポジション評価順位',
          'top-menu-group': 'グループバトル評価順位',
          'top-menu-nekkoya': 'ネッコヤ 個人カム順位',
          'garden-title': '国プの庭園の応援状況',
          'garden-step-view': '段階状況',
          'garden-video-view': '認証動画',
          'garden-timestamp-view': '達成日',
          'garden-days-view': '達成期間',
          'garden-step': '{{value}}段階',
          'garden-day': '日',
          'garden-rising-today': '今日アップ！',
          'special-title': '프로듀스 48 스페셜 영상 항목별 순위',
          'position-title': 'ポジション評価項目別順位',
          'group-title': 'グループバトル評価項目別順位',
          'nekkoya-title': 'ネッコヤ 個人カム項目別順位',
          'clip-heart': 'ハート',
          'clip-nc-heart': '네캐하트',
          'clip-twitter-heart': '트위터하트',
          'clip-play': '再生回数',
          'clip-comment': 'コメント',
          'direct-cam-heart': 'ハート',
          'direct-cam-play': '再生回数',
          'direct-cam-comment': 'コメント',
          'offline-vote': '現場投票',
          'be-updated-every-midnight': '毎日午前0時にアップデートされます。',
          'be-updated-every-five-minutes': '5分ごとに最新情報が更新されます。',
          'placeholder-name': '名前',
          'weekly-rank-chart': '週別投票順位の変動',
          'week': '週目',
          'rank': '位',
          'preparing': '準備中',
          'invalid-url': '잘못된 주소로 접근하셨습니다.',
          'use-menu-on-top': '상단 메뉴를 통해 정상 페이지를 이용해주세요.',
          'vote-your-girl': '당신의 소녀에게 투표하세요.',
        }
      }
    }
  });
export default i18n;