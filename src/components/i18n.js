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
          'top-menu-garden': '국정원 후원 현황',
          'top-menu-position': '포지션 평가 순위',
          'top-menu-group': '그룹 배틀 순위',
          'top-menu-nekkoya': '내꺼야 직캠 순위',
          'garden-title': '국프의 정원 후원 현황',
          'garden-step-view': '단계현황',
          'garden-video-view': '인증영상',
          'garden-timestamp-view': '달성일',
          'garden-days-view': '달성기간',
          'garden-step': '{{value}}단계',
          'garden-day': '일',
          'garden-rising-today': '오늘 상승!',
          'position-title': '프로듀스 48 포지션 평가 항목별 순위',
          'group-title': '프로듀스 48 그룹 배틀 항목별 순위',
          'nekkoya-title': '프로듀스 48 내꺼야 직캠 항목별 순위',
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
        }
      },
      jp: {
        translation: {
          'top-menu-garden': '国プの庭園応援現況',
          'top-menu-position': 'ポジション評価順位',
          'top-menu-group': 'グループバトル順位',
          'top-menu-nekkoya': 'ネッコヤ 個人カム順位',
          'garden-title': '国プの庭園応援現況',
          'garden-step-view': '段階現況',
          'garden-video-view': '認証動画',
          'garden-timestamp-view': '達成日',
          'garden-days-view': '達成期間',
          'garden-step': '{{value}}段階',
          'garden-day': '日',
          'garden-rising-today': '今日アップ！',
          'position-title': 'ポジション評価項目別順位',
          'group-title': 'グループバトル項目別順位',
          'nekkoya-title': 'ネッコヤ 個人カム項目別順位',
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
        }
      }
    }
  });
export default i18n;