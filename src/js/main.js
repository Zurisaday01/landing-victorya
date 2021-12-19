'use strict';

//tab Elements
const tabsContainer = document.querySelector('.summary__tab-container');
const tabs = document.querySelectorAll('.summary__tab');
const containersInfoEl = document.querySelectorAll('.summary__content');
//video modal Elements
const btnsOpenEl = document.querySelectorAll('.btn-video-open');
const btnCloseEl = document.querySelector('#btn-video-close');
const videoMain = document.querySelector('.video');
const videoModal = document.querySelector('.video__modal');
const overlay = document.querySelector('.video__overlay');
//slide
const slides = document.querySelectorAll('.slide__el');
const btnLeft = document.querySelector('.slide__btn--left');
const btnRight = document.querySelector('.slide__btn--right');
//sticky navigation
const nav = document.querySelector('.header');
const hero = document.querySelector('.hero');
//Revelating sections
const allSections = document.querySelectorAll('.section-effect');
//lazy images
const imgTargets = document.querySelectorAll('img[data-src]');
//navigation responsive
const realNav = document.querySelector('.navigation__menu');
const toggleNav = document.querySelector('.navigation__toggle');
const navLinks = document.querySelectorAll('.navigation__item');
const inputEmail = document.querySelector('.contact__email');

//initial values
let curSlide = 0;
let maxSlide = slides.length;

//functionality tabs
tabsContainer.addEventListener('click', function (e) {
	//We always going to to select the btn, no matter if there are other element into de btn
	const clicked = e.target.closest('.summary__tab');

	if (!clicked) return;
	// remove active classes (1re = btns, 2do = containers)
	//contiene translate
	tabs.forEach(tab => tab.classList.remove('summary__tab--active'));

	containersInfoEl.forEach(container =>
		container.classList.remove('summary__content--active')
	);

	//add active classes
	clicked.classList.add('summary__tab--active');

	document
		.querySelector(`.summary__content--${clicked.dataset.tab}`)
		.classList.add('summary__content--active');
});

//functionality video (open, close)
const openModal = function () {
	videoModal.classList.remove('hidden');
	videoMain.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	videoModal.classList.add('hidden');
	videoMain.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenEl.forEach(function (btn) {
	btn.addEventListener('click', openModal);
});
btnCloseEl.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

const goToSlide = function (current) {
	slides.forEach(
		(slide, i) =>
			(slide.style.transform = `translateX(${105 * (i - current)}%)`)
	);
};
goToSlide(0);

const nextSlide = function () {
	if (curSlide === maxSlide - 1) {
		//to return to the begining
		curSlide = 0;
	} else {
		curSlide++;
	}
	goToSlide(curSlide);
};

const prevSlide = function () {
	//si es 0 NO necesito que sigua disminuyendo, porque se sale del carousel
	if (curSlide === 0) {
		curSlide = maxSlide - 1;
	} else {
		curSlide--;
	}
	goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

//functionality sticky navigation

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries;
	if (!entry.isIntersecting) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});

navObserver.observe(hero);

//Revelation section
const showSects = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;
	entry.target.classList.remove('section--hidden');

	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(showSects, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(sec => {
	sectionObserver.observe(sec);
	sec.classList.add('section--hidden');
});

//lazy load

const imageObs = function (entries, observer) {
	const [entry] = entries;

	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img');
	});
	observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(imageObs, {
	root: null,
	threshold: 0,
	rootMargin: '200px',
});

imgTargets.forEach(function (img) {
	imageObserver.observe(img);
	img.classList.add('lazy-img');
});

//Preloader
window.addEventListener('load', function (e) {
	this.document.querySelector('.preloader').classList.add('hidden-load');
});

//Advert
const advice = document.createElement('div');
advice.classList.add('advice-popup');

advice.innerHTML = `<div><p class="paragraph">Please keep in mind that possibly some images will be late in load, I had to implement this (you can see the blur) to give you a better performance 😁.</p>
<span class="advice-popup__bye"> Have a good day 👋</span></div>
<button class="btn btn--primary advice-popup__btn" id="advice-btn">I got it!</button>
`;

hero.append(advice);

document
	.querySelector('#advice-btn')
	.addEventListener('click', () => advice.remove());

// Navigation responsive

realNav.style.transition = 'all 0.3s';

const menu = function () {
	realNav.classList.toggle('active-nav');
	toggleNav.classList.toggle('toggle-close');
};

const showMenu = function () {
	toggleNav.addEventListener('click', () => menu());
};

showMenu();

const closeMenu = function (links) {
	links.forEach(link =>
		link.addEventListener('click', function () {
			if (window.innerWidth <= 700) {
				menu();
			} else {
				realNav.classList.remove('active-nav');
			}
		})
	);
};

closeMenu(navLinks);

// //smooth

realNav.addEventListener('click', function (e) {
	e.preventDefault();
	const item = e.target.closest('.navigation__link');

	//Guard clouse
	if (!item) return;

	const id = item.getAttribute('href');
	const el = document.querySelector(id);
	console.log(el);
	el.scrollIntoView({ behavior: 'smooth' });
});

//clear input
document.querySelector('.contact__btn').addEventListener('click', e => {
	e.preventDefault();

	if (inputEmail.value.includes('@') && inputEmail.value.includes('.com')) {
		inputEmail.value = '';

		const send = document.createElement('div');
		send.classList.add('send');
		send.innerHTML = `<div><p class="paragraph">Thanks for sending your email 👍</p>
		`;

		document.querySelector('.contact').append(send);
		setTimeout(() => {
			send.remove();
		}, 1000);
	}
});
