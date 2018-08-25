var d_categories = {
  "1": { "id": 1, "number": "1", "description": "한/일" },
  "2": { "id": 2, "number": "2", "description": "소속" },
  "3": { "id": 3, "number": "3", "description": "등급평가" },
  "4": { "id": 4, "number": "4", "description": "최종등급" },
}

var a_categories = Object.keys(d_categories).map(function(a) { return d_categories[a]; });