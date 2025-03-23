/****** [ gnb ]
 * comp.modal 기능이 있어야 함.
 */
const gnb = {
  mode: "pc", // 해상도 모드 변수
  gnbEl: "#gnb", // gnb 요소 선택자 변수
  depth: [".depth-1", ".depth-2"], // depth별 링크 선택자 배열 지정
  maxWidth: 200,
  maxHeight: 0,
  dep2WdArr: new Array(),
  dep2HeightArr: new Array(),
  init: function (el) {
    let $gnbEl = $(this.gnbEl);

    // pc일 경우
    if (gnb.mode == "pc") {
      // pc버전 아닌 경우 이벤트 unbind
      $gnbEl.find(gnb.depth[0]).unbind();

      // gnb 요소 전체 마우스 오버 이벤트
      $(gnb.gnbEl).on("mouseenter", event_gnb_mouseenter);
      // gnb 요소 전체 마우스 아웃 이벤트
      $gnbEl.on("mouseleave", event_gnb_mouseleave);
      // 2차 메뉴 마우스 오버 이벤트
      $gnbEl.find(gnb.depth[1]).on("mouseenter", evetn_dep2_mouseenter);
      // 2차 메뉴 마우스 아웃 이벤트
      $gnbEl.find(gnb.depth[1]).on("mouseleave", event_dep2_mouseleave);
      // 1차메뉴 focus 이벤트
      $gnbEl.find(gnb.depth[0]).find(">a").on("focus", event_gnb_mouseenter);
      // 메뉴 링크외 링크요소 focus 이벤트
      $("a")
        .not(this.gnbEl + " a")
        .on("focus", event_gnb_mouseleave);

      // gnb 요소 전체 마우스 오버시 .active 추가
      function event_gnb_mouseenter() {
        $(gnb.gnbEl).addClass("active");
        $(".header").addClass("gnbActive");
        gnb.set();
      }
      // gnb 요소 전체 마우스 아웃시 .active 삭제
      function event_gnb_mouseleave() {
        $(gnb.gnbEl).removeClass("active");
        $(".header").removeClass("gnbActive");
      }

      // 2차 메뉴 마우스 오버 이벤트
      function evetn_dep2_mouseenter() {
        $gnbEl.find(".pointer").remove();
        $(this).parents("li").addClass("active");
        $(this)
          .find(">li>a")
          .on("mouseenter", function () {
            $gnbEl
              .find(".pointer")
              .addClass("on")
              .css("top", $(this).position().top + 4 + "px");
          });
        $(this)
          .find(">li>a")
          .on("mouseleave", function () {
            $gnbEl.find(".pointer").removeClass("on");
          });
      }

      // 2차 메뉴 마우스 아웃 이벤트
      function event_dep2_mouseleave() {
        $gnbEl.find(".pointer").remove();
        $(this).parents("li").removeClass("active");
      }
    } else {
      // 1600px 이하
      // pc버전 이벤트 unbind
      $(gnb.gnbEl).unbind();
      $gnbEl.find(gnb.depth[0]).find(">a").unbind();

      // 1차메뉴 클릭 시 2차메뉴 활성화 (slide)
      $gnbEl
        .find(gnb.depth[0])
        .find(">a")
        .on("click", function (e) {
          e.preventDefault();
          let $dep1 = $(this).parent();
          if (!$dep1.hasClass("open")) {
            $gnbEl.find(".open").find(gnb.depth[1]).slideUp();
            $gnbEl.find(".open").removeClass("open");
            $dep1.toggleClass("open");
            $dep1.find(gnb.depth[1]).slideToggle();
          }
        });
      //  사이드 메뉴 닫기
      $(".sideMenuCloseBtn").on("click", function () {
        $("body").removeClass("sideMenuOpen");
        comp.modal.remove();
      });
    }
  },
  set: function () {
    let $gnbEl = $(this.gnbEl);
    // 2차메뉴 배경 요소 추가
    if ($(gnb.gnbEl).find(".panel").length <= 0) {
      $(gnb.gnbEl).append('<div class="panel"></div>');
    }

    // 2차메뉴 max 높이,가로 체크 후 위치, 사이즈 조절
    $gnbEl.find(gnb.depth[1]).each(function (i, v) {
      gnb.dep2WdArr.push($(this).outerWidth());
      gnb.dep2HeightArr.push($(this).outerHeight());
    });
    // gnb.maxWidth = Math.max(...gnb.dep2WdArr);
    gnb.maxHeight = Math.max(...gnb.dep2HeightArr);

    // 2차메뉴 스타일 지정
    depthStyle();

    function depthStyle() {
      // 2차메뉴 배경 요소 높이 설정
      $gnbEl
        .find(".panel")
        .height(gnb.maxHeight)
        .css("top", $(".header").height() + "px");

      // 2차메뉴 가로/세로사이즈, 위치 조절
      $gnbEl.find(gnb.depth[1]).each(function (i, v) {
        $(this).css("height", gnb.maxHeight + "px");
      });
    }
  },
  reset: function () {
    let $gnbEl = $(this.gnbEl);
    $gnbEl.find(gnb.depth[0]).removeAttr("style");
    $gnbEl.find(gnb.depth[1]).removeAttr("style");
    $gnbEl.find(".open").removeClass("open");
    $(".allMenuActive").removeClass("allMenuActive");
    $(".allMenuBtn ").removeClass("toggle");
  },
};
$(function () {
  // gnb 메뉴 활성화
  gnb.init("#gnb");

  // 전체메뉴 클릭시 gnb 세팅
  $(".allMenuBtn").on("click", function () {
    gnb.set();
  });

  // 사이드 메뉴 활성화
  $(".sideMenuBtn").on("click", function () {
    comp.modal.init($(this));
    $("body").addClass("sideMenuOpen");
  });

  windowRsize();
  // window resize 해상도가 변경될 때
  $(window).resize(function () {
    windowRsize();
  });

  function windowRsize() {
    if (matchMedia("screen and (max-width: 780px)").matches) {
      $("body").addClass("mode-mobile");
      gnb.mode = "mobile";
    } else if (matchMedia("screen and (max-width: 1000px)").matches) {
      $("body").addClass("mode-middle");
      gnb.mode = "middle";
    } else {
      gnb.mode = "pc";
      $("body").removeClass();
      comp.modal.remove();
    }
    gnb.reset();
    gnb.init();
  }
});
