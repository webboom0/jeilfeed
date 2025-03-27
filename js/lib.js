/****** [ 상단이동] ******/
const moveTop = function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/****** [ select-form ] ******/
const selectForm = {
  wrap: ".select-form",
  area: ".select-area",
  selected: ".selected",
  option: ".option",
  item: ".opt-item",
  init: function() {
    document.querySelectorAll(this.wrap).forEach((wrap) => {
      wrap.querySelector(this.selected).addEventListener("click", function() {
        selectForm.inactive();
        wrap.classList.toggle("active");
      });

      wrap.querySelectorAll(this.item).forEach((item) => {
        item.addEventListener("click", function() {
          selectForm.optionSelect(item);
        });
      });
    });

    document.addEventListener("click", function(e) {
      if (!e.target.closest(selectForm.wrap)) {
        selectForm.inactive();
      }
    });
  },
  inactive: function(wrap) {
    if (wrap) {
      wrap.classList.remove("active");
    } else {
      document.querySelectorAll(this.wrap + ".active").forEach((activeWrap) => {
        activeWrap.classList.remove("active");
      });
    }
  },
  optionSelect: function(item) {
    const selectedText = item.getAttribute("data-value");
    const wrap = item.closest(this.wrap);
    const selectedElement = wrap.querySelector(this.selected);
    if (
      selectedElement.tagName === "INPUT" ||
      selectedElement.tagName === "TEXTAREA"
    ) {
      selectedElement.value = selectedText;
    } else {
      selectedElement.textContent = selectedText;
    }
    this.inactive(wrap);
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
    document.querySelectorAll(".dialog").forEach(function(val, idx) {
      val.addEventListener("click", dialog.handler);
    });
  },
  close(target) {
    dialog.target = target;
    document.querySelector("body").classList.remove("scroll-hdn");
    document.querySelector(target).classList.remove("open");
    document.querySelector(target).removeAttribute("tabindex");
    document.querySelectorAll(".dialog").forEach(function(val, idx) {
      val.removeEventListener("click", dialog.handler);
    });
  },
  full(e, target) {
    dialog.target = target;

    if (e.classList.contains("toggle")) {
      document.querySelector(target).classList.remove("dialog-full");
      e.classList.remove("toggle");
      e.querySelector("span").textContent = "기본화면으로 보기";
    } else {
      document.querySelector(target).classList.add("dialog-full");
      e.classList.add("toggle");
      e.querySelector("span").textContent = "전체화면으로 보기";
    }
  },
  handler: function(e) {
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
    $(window).resize(function() {
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
      val.classList.contains("active") ?
        val.setAttribute("aria-selected", "true") :
        val.setAttribute("aria-selected", "false");
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

      window.addEventListener("resize", function() {
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
      this.topArr.findIndex(isLargeNumber) < 0 ?
      this.topArr.length :
      this.topArr.findIndex(isLargeNumber);

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
  open: function() {
    document.querySelector("#gnb").classList.add("allMenuActive", "active");
    // document.querySelector(".header.gnbActive").classList.remove("gnbActive");
    document.querySelector("#gnb").setAttribute("tabindex", "0");
    document.querySelector("#gnb").focus();
    document.querySelector(".header").classList.add("allMenuActive");
    gnb.set();
  },
  close: function() {
    document.querySelector("#gnb").classList.remove("allMenuActive", "active");
    document.querySelector(".header").classList.remove("gnbActive");
    document.querySelector("#gnb").removeAttribute("tabindex");
    document.querySelector(".header").classList.remove("allMenuActive");
  },
};
/***** [ 검색 보이기/안보기 ] *******/
const searchToggle = function() {
  document.querySelector(".search-wrap").classList.toggle("close");
  const txt = document.querySelector(".search-wrap .head-group .txt");
  if (txt.textContent === "펼치기") {
    txt.textContent = "접기";
  } else {
    txt.textContent = "펼치기";
  }
};

document.addEventListener("DOMContentLoaded", function() {
  //dropMenu
  dropMenu.init();
  // tab기능 실행
  document.querySelectorAll('*[data-tab="tab"]').forEach((el) => {
    tab.init(el);
  });
  // table sort 기능
  document.querySelectorAll("table tr.sort-tr").forEach((tr) => {
    tr.querySelectorAll("th:not(.nosrot)").forEach((th) => {
      th.classList.add("up", "down");
      th.addEventListener("click", function(e) {
        e.preventDefault();
        const cell = e.currentTarget;
        console.log(
          cell.classList.contains("up") && cell.classList.contains("down"),
        );
        if (cell.classList.contains("up") && cell.classList.contains("down")) {
          cell.classList.remove("down");
        } else if (cell.classList.contains("up")) {
          cell.classList.remove("up");
          cell.classList.add("down");
        } else if (cell.classList.contains("down")) {
          cell.classList.add("up");
        }
      });
    });
  });

  // scroll-x touch scroll
  document.querySelectorAll(".scroll-box-row").forEach((el) => {
    touchScroll.init(el);
  });
});