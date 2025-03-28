/****** [ gnb ] ******/
const gnb = {
  mode: "pc", // 해상도 모드 변수
  gnbEl: "#gnb", // gnb 요소 선택자 변수
  depth: [".depth-1", ".depth-2"], // depth별 링크 선택자 배열 지정
  maxWidth: 150,
  maxHeight: 0,
  dep2WdArr: [],
  dep2HeightArr: [],
  gnbWidth: 1100,
  init: function() {
    const gnbElement = document.querySelector(this.gnbEl);

    // gnb 요소 전체 마우스 오버 이벤트
    gnbElement.addEventListener("mouseenter", event_gnb_mouseenter);
    // gnb 요소 전체 마우스 아웃 이벤트
    gnbElement.addEventListener("mouseleave", event_gnb_mouseleave);
    // 2차 메뉴 마우스 오버 이벤트
    gnbElement.querySelectorAll(gnb.depth[1]).forEach((el) => {
      el.addEventListener("mouseenter", evetn_dep2_mouseenter);
      el.addEventListener("mouseleave", event_dep2_mouseleave);
    });
    // 1차메뉴 focus 이벤트
    gnbElement.querySelectorAll(gnb.depth[0] + " > a").forEach((el) => {
      el.addEventListener("focus", event_gnb_mouseenter);
    });
    // 메뉴 링크외 링크요소 focus 이벤트
    document.querySelectorAll("a:not(" + this.gnbEl + " a)").forEach((el) => {
      el.addEventListener("focus", event_gnb_mouseleave);
    });

    // gnb 요소 전체 마우스 오버시 .active 추가
    function event_gnb_mouseenter() {
      if (gnb.mode === "pc") {
        gnbElement.classList.add("active");
        document.querySelector(".header").classList.add("gnbActive");
        gnb.set();
      }
    }
    // gnb 요소 전체 마우스 아웃시 .active 삭제
    function event_gnb_mouseleave() {
      if (gnb.mode === "pc") {
        gnbElement.classList.remove("active");
        document.querySelector(".header").classList.remove("gnbActive");
      }
    }

    // 2차 메뉴 마우스 오버 이벤트
    function evetn_dep2_mouseenter(e) {
      if (gnb.mode === "pc") {
        e.currentTarget.closest("li").classList.add("active");
      }
    }

    // 2차 메뉴 마우스 아웃 이벤트
    function event_dep2_mouseleave(e) {
      if (gnb.mode === "pc") {
        e.currentTarget.closest("li").classList.remove("active");
      }
    }

    // 1차메뉴 click 이벤트
    gnbElement.querySelectorAll(gnb.depth[0] + " > a").forEach((el) => {
      el.addEventListener("click", event_menu_click);
    });

    function event_menu_click(e) {
      if (gnb.mode === "middle" || gnb.mode === "mobile") {
        e.preventDefault();
        const dep1 = e.currentTarget.parentElement;

        gnbElement.querySelectorAll(gnb.depth[0]).forEach((el) => {
          if (el != dep1) {
            if (el.classList.contains("open")) {
              // 오픈되어있는 메뉴 비활성화
              slideUp(el.querySelector(gnb.depth[1]));
              el.classList.remove("open");
            }
          } else {
            if (el.classList.contains("open")) {
              // 선택한 메뉴 비활성화
              slideUp(el.querySelector(gnb.depth[1]));
              el.classList.remove("open");
            } else {
              // 선택한 메뉴 활성화
              slideDown(dep1.querySelector(gnb.depth[1]));
              dep1.classList.add("open");
            }
          }
        });
      }
    }
    //  사이드 메뉴 닫기
    document.querySelectorAll(".sideMenuCloseBtn").forEach((btn) => {
      btn.addEventListener("click", function() {
        document.body.classList.remove("sideMenuOpen", "modal");
      });
    });

    function slideDown(element, duration = 400) {
      element.style.removeProperty("display");
      let display = window.getComputedStyle(element).display;

      if (display === "none") display = "block";

      element.style.display = display;
      let height = element.offsetHeight;
      element.style.overflow = "hidden";
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;
      element.offsetHeight; // Trigger a reflow, flushing the CSS changes
      element.style.transitionProperty = "height, margin, padding";
      element.style.transitionDuration = duration + "ms";
      element.style.height = height + "px";
      element.style.removeProperty("padding-top");
      element.style.removeProperty("padding-bottom");
      element.style.removeProperty("margin-top");
      element.style.removeProperty("margin-bottom");

      window.setTimeout(() => {
        element.style.removeProperty("height");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition-duration");
        element.style.removeProperty("transition-property");
      }, duration);
    }

    function slideUp(element, duration = 400) {
      element.style.height = element.offsetHeight + "px";
      element.style.transitionProperty = "height, margin, padding";
      element.style.transitionDuration = duration + "ms";
      element.offsetHeight; // Trigger a reflow, flushing the CSS changes
      element.style.overflow = "hidden";
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;

      window.setTimeout(() => {
        element.style.display = "none";
        element.style.removeProperty("height");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition-duration");
        element.style.removeProperty("transition-property");
        element.style.removeProperty("padding-top");
        element.style.removeProperty("padding-bottom");
        element.style.removeProperty("margin-top");
        element.style.removeProperty("margin-bottom");
      }, duration);
    }
  },
  set: function() {
    const gnbElement = document.querySelector(this.gnbEl);
    // 2차메뉴 배경 요소 추가
    if (!gnbElement.querySelector(".panel")) {
      const panel = document.createElement("div");
      panel.className = "panel";
      gnbElement.appendChild(panel);
    }
    const length = gnbElement.querySelectorAll(gnb.depth[1]).length;
    const wd = gnb.gnbWidth / length;
    // 2차메뉴 max 높이,가로 체크 후 위치, 사이즈 조절
    gnbElement.querySelectorAll(gnb.depth[1]).forEach((el, i) => {
      el.style.width = wd + "px";
      gnb.dep2HeightArr.push(el.offsetHeight);
    });
    gnb.maxHeight = Math.max(...gnb.dep2HeightArr);
    document.querySelector(".totalMenuCloseBtn").style.top = `${
      gnb.maxHeight + 120
    }px`;

    // 2차메뉴 스타일 지정
    depthStyle();

    function depthStyle() {
      // 2차메뉴 배경 요소 높이 설정
      gnbElement.querySelector(".panel").style.height = gnb.maxHeight + "px";

      // 2차메뉴 가로/세로사이즈, 위치 조절
      gnbElement.querySelectorAll(gnb.depth[1]).forEach((el) => {
        el.style.height = gnb.maxHeight + "px";
      });
    }
  },
  reset: function() {
    const gnbElement = document.querySelector(this.gnbEl);
    gnbElement
      .querySelectorAll(gnb.depth[0])
      .forEach((el) => el.removeAttribute("style"));
    gnbElement
      .querySelectorAll(gnb.depth[1])
      .forEach((el) => el.removeAttribute("style"));
    gnbElement
      .querySelectorAll(".open")
      .forEach((el) => el.classList.remove("open"));

    document
      .querySelectorAll(".allMenuBtn")
      .forEach((el) => el.classList.remove("toggle"));
    document.querySelectorAll("#gnb .etcMenu").forEach((el) => el.remove());
  },
  pcReset: function() {
    const gnbElement = document.querySelector("#gnb");
    gnbElement
      .querySelectorAll(gnb.depth[0])
      .forEach((el) => el.removeAttribute("style"));
    gnbElement
      .querySelectorAll(gnb.depth[1])
      .forEach((el) => el.removeAttribute("style"));
    document
      .querySelectorAll(".allMenuActive")
      .forEach((el) => el.classList.remove("allMenuActive"));

    gnbElement.classList.remove("active");
  },
};

document.addEventListener("DOMContentLoaded", function() {
  // gnb 메뉴 활성화
  gnb.init();

  // 사이드 메뉴 활성화
  document.querySelectorAll(".sideMenuBtn").forEach((btn) => {
    btn.addEventListener("click", function(e) {
      document.body.classList.add("sideMenuOpen", "modal");
      document.querySelectorAll("#gnb .etcMenu").forEach((el) => el.remove());
      const etcMenu = document.querySelector(".header .etcMenu");
      if (etcMenu) {
        const clone = etcMenu.cloneNode(true);
        document.querySelector("#gnb").prepend(clone);
      }
    });
  });

  windowRsize();
  // window resize 해상도가 변경될 때
  window.addEventListener("resize", function() {
    windowRsize();
  });

  function windowRsize() {
    if (window.matchMedia("screen and (max-width: 780px)").matches) {
      document.body.classList.add("mode-mobile");
      gnb.mode = "mobile";
      gnb.pcReset();
    } else if (
      window.matchMedia(`screen and (max-width: 1200px`).matches
    ) {
      document.body.classList.add("mode-middle");
      gnb.mode = "middle";
      gnb.pcReset();
    } else {
      gnb.mode = "pc";
      document.body.className = ""; // 모든 클래스 제거
      document.body.classList.remove("modal");
      gnb.set();
    }
    gnb.reset();
  }
})