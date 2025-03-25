const comp = {
  /****** [ 상단이동 ] ******/
  moveTop: function () {
    $("body,html").animate({ scrollTop: 0 }, 500);
  },

  /****** [ active클래스 토글 기능 ] ******/
  toggleActive: function ($this, el, className = "active", title) {
    $(el).toggleClass(className);
    $this.toggleClass("toggle");
    const arr = title.split("/");
    const tit = $this.attr("title");
    const txt = arr.filter((t) => t != tit);
    $this.attr("title", txt[0]);
  },

  /****** [ pause 정지버튼 ] ******/
  pause: function ($el, swiper) {
    if (!$el.hasClass("on")) {
      $el.addClass("on");
      swiper.autoplay.pause();
      $el.find(".txt").text("재생");
      $el.find(".bx").addClass("bx-play");
    } else {
      $el.removeClass("on");
      swiper.autoplay.start();
      $el.find(".txt").text("정지");
      $el.find(".bx").removeClass("bx-play");
    }
  },
  /****** [ modal ] ******/
  modal: {
    modalClickable: "true", // data-modalClickable 속성이 true 이면 modalPanel 클릭시 modal 삭제
    dialog: "", // 다이어로그 요소
    init: function ($el) {
      // 다이어로그 있을 경우 dialog 변수에 저장
      this.dialog = $el.attr("data-dialog") ? $el.attr("data-dialog") : "";

      // 다이어로그 있을 경우 활성화
      if (this.dialog != "") {
        let $dialog = $(this.dialog);
        this.modalDialog($dialog);
      } else {
        this.toggleModal($el.attr("data-modalClickable"));
      }

      // modal 속성에 data-modalClickable 속성값이 true인 경우 모달패널 클릭시 모달 닫기 기능 됨.
      //if ($el.attr("data-modalClickable")) this.modalClickable = $el.attr("data-modalClickable");
    },
    modalDialog: ($dialogEl) => {
      $dialogEl.addClass("active");
      // $dialogEl.focus();

      // 다이어로그 내 닫기버튼 클릭시 모달-다이어로그 비활성화
      $dialogEl.find("*[data-close = 'dialog']").on("click", function (e) {
        e.preventDefault();
        $dialogEl.removeClass("active");
        comp.modal.remove();
      });
      comp.modal.toggleModal("true");
    },
    modalClick: function (c) {
      if (c == "true") {
        $(".modal .modalPanel").on("click", function () {
          comp.modal.remove();
        });
      }
    },
    toggleModal: function (clickable = "true") {
      // modal 유무 체크 없을 경우 .active 추가 (활성화) / 있을 경우 .active 삭제 (비활성화)
      if (!$("body").hasClass("modal")) {
        $("body").addClass("modal").append("<div class='modalPanel'></div>");
        this.modalClick(clickable);
      } else {
        comp.modal.remove();
      }
    },
    // 모달 비활성화
    remove: function () {
      $("body").removeClass("modal");
      $(".modalPanel").remove();
      if ($(".modal-dialog.active").length > 0) {
        $(".modal-dialog.active").removeClass("active");
      }
    },
  },
};

/****** [ select-form ] ******/
const selectForm = {
  wrap: ".select-form",
  area: ".select-area",
  selected: ".selected",
  option: ".option",
  item: ".opt-item",
  init: () => {
    $(selectForm.wrap)
      .find(selectForm.selected)
      .on("click", function () {
        selectForm.inactive();
        $(this).parents(selectForm.wrap).toggleClass("active");
      });

    $(selectForm.wrap).on("click", selectForm.item, function () {
      selectForm.optionSelect($(this));
      // sub.html 에서 사용됨.
      //codeChange();
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(selectForm.wrap)) {
        selectForm.inactive();
      }
    });
  },
  inactive: ($wrap) => {
    if ($wrap) {
      $wrap.removeClass("active");
    } else {
      $(selectForm.wrap + ".active").removeClass("active");
    }
  },
  optionSelect: ($this) => {
    const selectedText = $this.attr("data-value");
    $this.parents(selectForm.wrap).find(selectForm.selected).val(selectedText);
    selectForm.inactive($this.parents(selectForm.wrap));
  },
};

/****** [ dialog ] ******/
const dialog = {
  target: null,
  open(target) {
    dialog.target = target;
    document.querySelector("body").classList.add("scroll-hdn");
    document.querySelector(target).classList.add("open");
    document.querySelector(target).setAttribute("tabindex", "0");
    document.querySelector(target).focus();
    document.querySelectorAll(".dialog").forEach(function (val, idx) {
      val.addEventListener("click", dialog.handler);
    });
  },
  close(target) {
    dialog.target = target;
    document.querySelector("body").classList.remove("scroll-hdn");
    document.querySelector(target).classList.remove("open");
    document.querySelector(target).removeAttribute("tabindex");
    document.querySelectorAll(".dialog").forEach(function (val, idx) {
      val.removeEventListener("click", dialog.handler);
    });
  },
  handler: function (e) {
    if (!e.target.closest(".inner")) {
      dialog.close(dialog.target);
    }
  },
};

/****** [ scroll-x touch scroll ] ******/
const touchScroll = {
  isDown: false,
  startX: null,
  scrollLeft: null,
  init(sliderEl) {
    // sliderEl.style.cursor = "move";
    touchScroll.cursor(sliderEl);
    $(window).resize(function () {
      touchScroll.cursor(sliderEl);
    });
    sliderEl.addEventListener("mousedown", this.mousedownHandler.bind(this));
    sliderEl.addEventListener("mouseleave", this.mouseleaveHandler.bind(this));
    sliderEl.addEventListener("mouseup", this.mouseupHandler.bind(this));
    sliderEl.addEventListener("mousemove", this.mousemoveHandler.bind(this));
  },
  cursor(sliderEl) {
    // 스크롤 가능 여부 확인
    const hasScroll = sliderEl.scrollWidth > sliderEl.clientWidth;
    // 스크롤이 있을 때만 move 커서 적용
    if (hasScroll) {
      sliderEl.style.cursor = "move";
    } else {
      sliderEl.style.cursor = "default";
    }
  },
  mousedownHandler(e) {
    const slider = e.currentTarget;
    this.isDown = true;
    slider.classList.add("active");
    this.startX = e.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  },
  mouseleaveHandler(e) {
    const slider = e.currentTarget;
    this.isDown = false;
    slider.classList.remove("active");
  },
  mouseupHandler(e) {
    const slider = e.currentTarget;
    this.isDown = false;
    slider.classList.remove("active");
  },
  mousemoveHandler(e) {
    if (!this.isDown) return;
    e.preventDefault();
    const slider = e.currentTarget;
    const x = e.pageX - slider.offsetLeft;
    const walk = x - this.startX;
    slider.scrollLeft = this.scrollLeft - walk;
  },
  scrollMove(container, offsetLeft) {
    document.querySelector(container).scrollLeft = offsetLeft;
  },
};

/****** [  탭 기능 (arir 추가) ] ******/
const tab = {
  // 탭 링크 속성에 id, aria-controls 속성 꼭 넣어야 함.
  init(el) {
    let activeTab = `#${el
      .querySelector(".active")
      .getAttribute("aria-controls")}`;

    el.querySelectorAll("*[aria-controls]").forEach((val) => {
      let target = `#${val.getAttribute("aria-controls")}`;
      if (activeTab != target)
        document.querySelector(target).style.display = "none";
      this.eventLinstener(val);
    });

    this.ariaInit(el);
  },
  eventLinstener(val) {
    val.addEventListener("click", this.clickHandler.bind(this));
  },
  clickHandler(e) {
    e.preventDefault();
    const container = e.target.closest("*[data-tab=tab]");
    const pastTarget = `#${container
      .querySelector(".active")
      .getAttribute("aria-controls")}`;
    const activeTarget = `#${e.currentTarget.getAttribute("aria-controls")}`;
    const display = container.querySelector(pastTarget).style.display;

    this.hide(container.querySelector(".active"), pastTarget);
    this.show(e.currentTarget, activeTarget, display);
  },
  hide(link, target) {
    link.classList.remove("active");
    document.querySelector(target).style.display = "none";

    // attribute
    link.setAttribute("title", "");
    link.setAttribute("aria-selected", "false");
  },
  show(link, target, display) {
    link.classList.add("active");
    document.querySelector(target).style.display = display;

    // attribute
    link.setAttribute("title", "선택됨");
    link.setAttribute("aria-selected", "true");
  },
  ariaInit(container) {
    container.querySelector(".tab-links").setAttribute("role", "tablist");
    container.querySelectorAll("*[aria-controls]").forEach((val) => {
      const target = `#${val.getAttribute("aria-controls")}`;
      const linkId = val.getAttribute("id");
      val.setAttribute("role", "tab");
      val.setAttribute("title", "선택됨");
      val.classList.contains("active")
        ? val.setAttribute("aria-selected", "true")
        : val.setAttribute("aria-selected", "false");
      container.querySelector(target).setAttribute("role", "tabpanel");
      container.querySelector(target).setAttribute("aria-labelledby", linkId);
    });
  },
};
/****** [  scroll 기능 tab) ] ******/
const scrollTab = {
  wrap: ".scrollTab-box",
  tit: ".scrollTab-box .box-tit-group .tit",
  topArr: [],
  init() {
    const tabBox = document.createElement("div");
    tabBox.classList.add("tab-wrap");
    tabBox.classList.add("scroll-box-row");
    tabBox.classList.add("style-scroll");
    document.querySelectorAll(this.tit).forEach((title, idx) => {
      const btn = document.createElement("button");
      btn.classList.add("tab");
      idx === 0 ? btn.classList.add("active") : "";
      btn.textContent = title.textContent;
      btn.setAttribute("data-target", `cont-${idx}`);
      title.parentNode.setAttribute("id", `cont-${idx}`);
      btn.addEventListener("click", this.clickHandler.bind(this));
      tabBox.append(btn);

      $(window).resize(function () {
        scrollTab.setTop();
      });
    });
    document.querySelector(this.wrap).prepend(tabBox);
    this.setTop();
    window.addEventListener("scroll", this.scrollHandler.bind(this));
  },
  clickHandler(e) {
    const btn = e.currentTarget;
    const target = btn.getAttribute("data-target");
    const top = document.getElementById(target).offsetTop;

    // this.active(btn);
    $("body,html").animate({ scrollTop: top }, 500);
  },
  scrollHandler(e) {
    const scrollTop = $(window).scrollTop();
    const isLargeNumber = (element) => element > scrollTop;
    const wrapHeight = document.querySelector(".wrap").clientHeight;
    const bodyHeight = document.body.clientHeight;
    let findIdx =
      this.topArr.findIndex(isLargeNumber) < 0
        ? this.topArr.length
        : this.topArr.findIndex(isLargeNumber);

    if (scrollTop < this.topArr[0]) {
      findIdx = 0;
    } else if (
      scrollTop >= this.topArr[this.topArr.length - 1] ||
      scrollTop >= wrapHeight - bodyHeight - 30
    ) {
      findIdx = this.topArr.length - 1;
    } else {
      findIdx = findIdx - 1;
    }
    this.active(document.querySelectorAll(`${this.wrap} .tab`)[findIdx]);
  },
  active(btn) {
    document
      .querySelector(`${this.wrap} .tab-wrap .active`)
      .classList.remove("active");
    btn.classList.add("active");
    touchScroll.scrollMove(".scrollTab-box .scroll-box-row", btn.offsetLeft);
  },
  setTop() {
    const headHeight = document.querySelector(".header").clientHeight - 1;
    document.querySelector(`${this.wrap} .tab-wrap`).style.top =
      headHeight + "px";
    this.topArr = new Array();
    document.querySelectorAll(this.tit).forEach((title) => {
      this.topArr.push(title.offsetTop);
    });
  },
};

/***** [ DropDown ] *******/
const dropMenu = {
  wrap: ".drop-wrap",
  btn: ".drop-btn",
  activeMenu: null,
  init: () => {
    const $wrap = document.querySelectorAll(dropMenu.wrap);
    // const $btn = $wrap.querySelectorAll(dropMenu.btn);
    $wrap.forEach((item) => {
      if (
        item.querySelector(dropMenu.btn).querySelectorAll("span").length <= 0
      ) {
        const el = document.createElement("span");
        el.classList.add("sr-only");
        el.innerHTML = "열기";
        item.querySelector(dropMenu.btn).appendChild(el);
      }

      item.querySelector(dropMenu.btn).addEventListener("click", (e) => {
        const $target = e.target;
        dropMenu.actvieMenu = e.target.closest(dropMenu.wrap);

        // 선택된 드롭메뉴 토글기능
        if (!dropMenu.actvieMenu.classList.contains("active")) {
          dropMenu.dropMenuClose();
          dropMenu.actvieMenu.classList.add("active");
          $target.querySelector("span").innerHTML = "닫기";
        } else {
          dropMenu.actvieMenu.classList.remove("active");
          $target.querySelector("span").innerHTML = "열기";
        }
      });
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(dropMenu.wrap)) {
        dropMenu.dropMenuClose();
      }
    });
  },
  dropMenuClose: () => {
    const $dropMenus = document.querySelectorAll(dropMenu.wrap + ".active");
    // 활성화되어있는 dropMenu 비활성화 시키기
    if ($dropMenus.length > 0) {
      $dropMenus.forEach((menu) => {
        menu.classList.remove("active");
      });
    }
  },
};
/***** [ 상단 사이트맵(전체메뉴) ] *******/
const totalMenu = {
  open: function () {
    document.querySelector("#gnb").classList.add("allMenuActive", "active");
    // document.querySelector(".header.gnbActive").classList.remove("gnbActive");
    document.querySelector("#gnb").setAttribute("tabindex", "0");
    document.querySelector("#gnb").focus();
    document.querySelector(".header").classList.add("allMenuActive");
    gnb.set();
  },
  close: function () {
    document.querySelector("#gnb").classList.remove("allMenuActive", "active");
    document.querySelector(".header").classList.remove("gnbActive");
    document.querySelector("#gnb").removeAttribute("tabindex");
    document.querySelector(".header").classList.remove("allMenuActive");
  },
};
/***** [ 검색 보이기/안보기 ] *******/
const searchToggle = function () {
  document.querySelector(".search-wrap").classList.toggle("close");
  const txt = document.querySelector(".search-wrap .head-group .txt");
  if (txt.textContent === "펼치기") {
    txt.textContent = "접기";
  } else {
    txt.textContent = "펼치기";
  }
};

$(function () {
  //dropMenu
  dropMenu.init();
  // tab기능 실행
  document.querySelectorAll('*[data-tab="tab"]').forEach((el) => {
    tab.init(el);
  });

  // scroll-x touch scroll
  document.querySelectorAll(".scroll-box-row").forEach((el) => {
    touchScroll.init(el);
  });
});
