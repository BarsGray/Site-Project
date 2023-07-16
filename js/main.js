
// ======================== Smooth-scroll =================

const tubsNavHeader = document.querySelector('.header__nav-list');
const tubsNavFooter = document.querySelector('.footer__nav-list');

tubsNavHeader.addEventListener('click', scrollToElement);
tubsNavFooter.addEventListener('click', scrollToElement);

function scrollToElement(evt) {
  evt.preventDefault();

  if (evt.target.closest('.header__nav-link') || evt.target.closest('.footer__nav-link')) {
    let targetId = evt.target.getAttribute('href');

    document.documentElement.scrollTo({
      top: targetId === '#' ? 0 : document.querySelector(targetId).offsetTop + 30,
      behavior: 'smooth'
    });

    if (window.innerWidth <= 1120 && menuButton.closest('.header__menu-button--active')) {
      openMenu();
    }
  }
}

// ======================== Smooth-scroll =================

// ======================== Header-Menu-Active ============

const menuButton = document.querySelector('.header__menu-button');
const headerMenu = document.querySelector('.header__top-inner')
const overlay = document.querySelector('.overlay');

menuButton.addEventListener('click', openMenu);

function openMenu() {
  // document.querySelector('body').classList.toggle('scroll-nane');

  menuButton.classList.toggle('header__menu-button--active');
  headerMenu.classList.toggle('header__top-inner--visible');
  overlay.classList.toggle('overlay--visible');

  if (menuButton.closest('.header__menu-button--active')) {
    overlay.addEventListener('click', openMenu, true)
  } else {
    overlay.removeEventListener('click', openMenu)
  }
}

// ======================== Header-Menu-Active ============

// =============================== Filter =================

const filterBox = document.querySelector('.blog__filter-box');
const filterBtn = document.querySelectorAll('.blog__filter-btn');
const items = document.querySelectorAll('.blog__list-item');

let dataFilter;

filterBox.addEventListener('click', btnActive);

function btnActive(event) {
  if (event.target.closest('.blog__filter-btn')) {

    filterBtn.forEach((btn) => {
      btn.classList.remove('blog__filter-btn--active');
    });

    event.target.classList.add('blog__filter-btn--active');
    dataFilter = event.target.dataset.filter;

    items.forEach((item) => {
      item.classList.remove('blog__list-item--active');
      item.classList.add('blog__list-item--hidden');
      item.classList.remove('blog__list-item--visible');
      // item.setAttribute('style', 'opacity: 0;');
    });

    if (dataFilter == 'all') {
      items.forEach((item) => {
        item.classList.add('blog__list-item--active');
        setTimeout(() => {
          item.classList.add('blog__list-item--visible');
          // item.setAttribute('style', 'opacity: 1; transition: .5s;');
        }, 10);
      })
    }

    else {
      items.forEach((item) => {
        if (item.classList.contains('blog__list-item--' + dataFilter)) {
          item.classList.add('blog__list-item--active');
          setTimeout(() => {
            item.classList.add('blog__list-item--visible');
            // item.setAttribute('style', 'opacity: 1; transition: .5s;');
          }, 10);
        }
      })
    }
  }
}

// =============================== Filter ==============


// =============================== Karusele ============

const sliderLine = document.querySelector('.reviews__slider-line');
const reviewsSlide = document.querySelectorAll('.reviews__slider-item');
const sliderButtons = document.querySelector('.reviews__slider-buttons');

// +++++ Options!!! +++

let slideShowQuantity = 2;
let slideShowCount = 2;
const flexGap = 48;

// +++++ ++++++++++ +++

function widthAsc() {
  if (window.innerWidth < 1020) {
    slideShowCount = 1;
    slideShowQuantity = 1;
  } else {
    slideShowCount = 2;
    slideShowQuantity = 2;
  }
}

widthAsc();

// +++++ ++++++++++ +++



let sliderCount = 0;
let sliderPosition = 0;
let dotsItems;

const dotsBox = document.querySelector('.reviews__dots__box');

function dotsCreate() {
  let elemCount = Math.ceil(((reviewsSlide.length) / slideShowQuantity));
  let dotCount = 0;

  if (slideShowQuantity % 2 != 0 && slideShowCount == 1) {
    dotCount = 0;
  } else if (slideShowQuantity % 2 != 0) {
    dotCount = 1;
  }

  while (elemCount > dotCount) {

    let dots = document.createElement('li');
    dots.className = 'reviews__dot-item';
    dots.innerHTML = '<button id="' + ((Math.ceil((reviewsSlide.length) / slideShowQuantity) - elemCount) * slideShowQuantity) + '" class="reviews__dot-link"></button>';
    dotsBox.append(dots);

    elemCount--;
  }
  dotsItems = document.querySelectorAll('.reviews__dot-link');

  document.getElementById(sliderCount).classList.add('reviews__dot-link--active');
}

dotsCreate();

let control = 0;
window.addEventListener('resize', () => {

  if (window.innerWidth < 1020 && control == 0) {
    document.querySelectorAll('.reviews__dot-item').forEach((elem) => {
      elem.remove();
    });
    widthAsc();
    dotsCreate();
    control = 1;
  } else if (window.innerWidth > 1020 && control != 0) {
    document.querySelectorAll('.reviews__dot-item').forEach((elem) => {
      elem.remove();
    });

    if (sliderCount % 2 != 0 && reviewsSlide.length - slideShowQuantity != sliderCount) {
      sliderCount += 1;
    } else if (sliderCount % 2 != 0 && reviewsSlide.length - slideShowQuantity == sliderCount) {
      sliderCount -= 1;
    }
    control = 0;
    widthAsc();
    dotsCreate();
  }
  sliderMov();
});


dotsBox.addEventListener('click', dotActive);

let idDots = 0;
function dotActive(evt) {

  if (evt.target.closest('.reviews__dot-link')) {

    idDots = Math.abs(evt.target.id);

    sliderCount = idDots;
    sliderMov();
  }
}



sliderButtons.addEventListener('click', clickBtn);

function clickBtn(event) {

  if (event.target.closest('.reviews__next')) {
    movNext();
  } else if (event.target.closest('.reviews__prev')) {
    movPrev();
  }
}


function movNext() {
  sliderCount += slideShowQuantity;

  if (slideShowQuantity % 2 == 0) {

    if (sliderCount >= reviewsSlide.length) {
      sliderCount = 0;
    }

  } else if (slideShowQuantity % 2 != 0) {

    if (slideShowCount == 1) {

      if (sliderCount >= reviewsSlide.length) {
        sliderCount = 0;
      }
    } else {
      if (sliderCount >= reviewsSlide.length - 1) {
        sliderCount = 0;
      }
    }
  }

  sliderMov();
}

function movPrev() {

  if (slideShowQuantity % 2 == 0) {
    if (sliderCount <= 0) {
      sliderCount = reviewsSlide.length;
    }
  } else if (slideShowQuantity % 2 != 0) {
    if (sliderCount <= 0) {
      if (slideShowCount == 1) {
        sliderCount = reviewsSlide.length;
      } else {
        sliderCount = reviewsSlide.length - 1;
      }
    }
  }

  sliderCount -= slideShowQuantity;
  sliderMov();
}


function sliderMov() {

  dotsItems.forEach((elem) => {
    elem.classList.remove('reviews__dot-link--active');
  });


  if (reviewsSlide.length - slideShowQuantity < sliderCount) {

    sliderPosition = (reviewsSlide[0].clientWidth + flexGap) * (sliderCount - (reviewsSlide.length - sliderCount));
    sliderCount = reviewsSlide.length - slideShowQuantity;


    document.getElementById(sliderCount + 1).classList.add('reviews__dot-link--active');

  } else if (sliderCount < 0) {
    sliderPosition = 0;
    sliderCount = 0;

    document.getElementById(sliderCount).classList.add('reviews__dot-link--active');

  } else {
    sliderPosition = (reviewsSlide[0].clientWidth + flexGap) * sliderCount;

    if (sliderCount % slideShowQuantity != 0) {
      document.getElementById(sliderCount + 1).classList.add('reviews__dot-link--active');

    } else {
      document.getElementById(sliderCount).classList.add('reviews__dot-link--active');
    }
  }

  sliderLine.setAttribute('style', 'transform:' + 'translateX(' + -sliderPosition + 'px); ' + 'transition: all .3s;');

  // document.querySelectorAll(#0).classList.add('reviews__dot-link--active');
}

setInterval(movNext, 2500);
// setInterval(movPrev, 2500);




sliderLine.addEventListener('mousedown', startMousePoint);
sliderLine.addEventListener('touchstart', startTouchPoint);
sliderLine.addEventListener('mouseup', moveOff);

let mouseStart = 0;
let mouseX = 0;

function startMousePoint(event) {
  mouseStart = event.clientX;

  sliderLine.addEventListener('mousemove', eveMouseMove);
  sliderLine.addEventListener('mouseout', moveOff);
}

function startTouchPoint(evt) {
  mouseStart = evt.touches[0].clientX;

  sliderLine.addEventListener('touchmove', eveTouchMove);
  sliderLine.addEventListener('touchend', moveTouchOff);
}


function eveMouseMove(event) {

  mouseX = mouseStart - event.clientX;
  sliderLine.setAttribute('style', 'transform:' + 'translateX(' + -(((reviewsSlide[0].clientWidth + flexGap) * sliderCount) + mouseX) + 'px); ');
}

function eveTouchMove(event) {
  event.preventDefault();

  mouseX = mouseStart - event.touches[0].clientX;
  sliderLine.setAttribute('style', 'transform:' + 'translateX(' + -(((reviewsSlide[0].clientWidth + flexGap) * sliderCount) + mouseX) + 'px); ');
}


function moveOff() {

  if (mouseX < 200 && mouseX > -200) {
    sliderMov();
  } else if (mouseX > 200) {
    movNext();
  } else if (mouseX < -200) {
    movPrev();
  }

  // +++++ Закоментировать для прокрутки по клику +++

  mouseX = 0;
  // ++++++++++ (Листни и кликни по слайду) +++++++++


  sliderLine.removeEventListener('mousemove', eveMouseMove);
  sliderLine.removeEventListener('mouseout', moveOff);
}

function moveTouchOff() {

  if (mouseX < 50 && mouseX > -50) {
    sliderMov();
  } else if (mouseX > 50) {
    movNext();
  } else if (mouseX < -50) {
    movPrev();
  }

  // +++++ Закоментировать для прокрутки по клику +++

  mouseX = 0;
  // ++++++++++ (Листни и кликни по слайду) +++++++++

  sliderLine.removeEventListener('touchmove', eveMouseMove);
  sliderLine.removeEventListener('touchend', moveOff);
}
// =============================== Karusele =============


// =============================== Accordion ============

const accordText = document.querySelectorAll('.questions__accord-content-box');
const accordLink = document.querySelectorAll('.questions__accord-item');
const accordLinkBox = document.querySelector('.questions__accord-box');


let accordLinkIDNum = 0;

accordLink.forEach((elem) => {
  elem.setAttribute('data-id', accordLinkIDNum)
  accordLinkIDNum++;
})


let accordTextIDNum = 0;

accordText.forEach((elem) => {
  elem.setAttribute('id', accordTextIDNum);
  accordTextIDNum++;
});

accordLink.forEach((elem) => {
  elem.addEventListener('click', openAccordText);
});

function openAccordText(evt) {
  evt.preventDefault();

  let elemId = evt.currentTarget.dataset.id;


  if (evt.currentTarget.classList.contains('questions__accord-item--active')) {

    evt.currentTarget.classList.remove('questions__accord-item--active');
    accordText[elemId].setAttribute('style', 'max-height:' + 0 + 'px; opacity: 0;');
  } else {
    resetAccord();

    evt.currentTarget.classList.add('questions__accord-item--active');
    accordText[elemId].setAttribute('style', 'max-height:' + accordText[elemId].scrollHeight + 'px; opacity: 1;');
  }

  function resetAccord() {
    accordLink.forEach((elem) => { elem.classList.remove('questions__accord-item--active') });
    accordText.forEach((elem) => { elem.setAttribute('style', 'max-height:' + 0 + 'px; opacity: 0;') });
  }
}
