const burgerBtn = document.querySelector('.burger-btn')
const burgerMenu = document.querySelector('.burger-container')
const showMore = document.getElementById('show-more')
let isExpanded = false

showMore.addEventListener('click', () => {
  for (elem of document.querySelectorAll('.services-grid')) {
    if (elem.offsetHeight > 0) {
      elem.style.maxHeight = '2000px'
      showMore.style.visibility = 'hidden'
      isExpanded = true
    }
  }
})

let opened = false
document.querySelector('.content').style.height = window.innerHeight + 'px'
document.querySelector('.welcome').style.height = window.innerHeight + 'px'

burgerBtn.addEventListener('click', () => {
  if (!opened) {
    burgerBtn.children[0].style.backgroundColor = '#fff'
    burgerBtn.children[1].style.backgroundColor = '#fff'
    burgerBtn.children[2].style.backgroundColor = '#fff'
    burgerMenu.style.left = '0'
    opened = true
  } else {
    burgerBtn.children[0].style.backgroundColor = '#463E3E'
    burgerBtn.children[1].style.backgroundColor = '#463E3E'
    burgerBtn.children[2].style.backgroundColor = '#463E3E'
    burgerMenu.style.left = '-250px'
    opened = false
  }
})

let scroll = 0
document.addEventListener('scroll', (event) => {
  if (!opened) {
    if (document.scrollingElement.scrollTop > scroll) {
      burgerBtn.style.opacity = '0'
      burgerBtn.style.visibility = 'hidden'
    } else {
      burgerBtn.style.visibility = 'visible'
      burgerBtn.style.opacity = '1'
    }
  }
  scroll = document.scrollingElement.scrollTop

  const scrollBottom =
    document.scrollingElement.scrollHeight -
    document.scrollingElement.scrollTop -
    document.scrollingElement.clientHeight

  if (scrollBottom < 300) {
    document.querySelector('.online-sign-abs').style.opacity = '0'
    document.querySelector('.online-sign-abs').style.visibility = 'hidden'
  } else {
    document.querySelector('.online-sign-abs').style.visibility = 'visible'
    document.querySelector('.online-sign-abs').style.opacity = '1'
  }
})

document.querySelector('.main__arrow').addEventListener('click', () => {
  window.scrollTo(0, window.innerHeight)
})

const filters = document.querySelectorAll('.service-filter')
for (const filter of filters) {
  filter.addEventListener('click', (event) => {
    changeServices(event.target)
  })
}

function changeServices(obj) {
  const filters = document.querySelectorAll('.service-filter')
  const services = document.querySelectorAll('.services-grid')
  for (const filter of filters) {
    filter.classList.remove('active-filter')
  }

  if (obj.localName == 'h2') {
    obj = obj.closest('.service-filter')
  }
  obj.classList.add('active-filter')

  for (const service of services) {
    service.style.maxHeight = '0'
    service.style.opacity = 0
  }

  for (const filter of filters) {
    if (filter.classList.contains('active-filter')) {
      const activeGrid = filter.classList[2]
      for (const service of services) {
        if (service.classList.contains(activeGrid)) {
          isExpanded = false
          service.style.maxHeight = '420px'
          service.style.opacity = 1
        }
      }
    }
  }
}

const swiperPopular = new Swiper('.popular-swiper', {
  direction: 'horizontal',
  loop: true,
  slidesPerView: 4,
  spaceBetween: '20px',
  speed: 7000,
  autoplay: {
    delay: 0,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },

  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },

  breakpoints: {
    1300: {
      slidesPerView: 4,
    },
    1024: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
    },
    0: {
      autoplay: false,
      speed: 250,
      slidesPerView: 1,
    },
  },
})

const swiperGallery = new Swiper('.swiper-gallery', {
  direction: 'horizontal',
  centeredSlides: true,
  slideToClickedSlide: true,
  loop: false,
  slidesPerView: 3,
  spaceBetween: '20px',
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 4000,
    pauseOnMouseEnter: true,
    disableOnInteraction: false,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    900: {
      slidesPerView: 3,
    },
    550: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
})

const swiperTeam = new Swiper('.swiper-team', {
  direction: 'horizontal',
  draggable: true,
  slidesPerView: 4,
  spaceBetween: '42px',

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    1300: {
      slidesPerView: 4,
    },
    900: {
      slidesPerView: 3,
    },
    550: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
})

const swiperFilters = new Swiper('.filters-swiper', {
  direction: 'horizontal',
  draggable: true,
  slidesPerView: 7,
  spaceBetween: '20px',

  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 7,
    },
    900: {
      slidesPerView: 6,
    },
    600: {
      slidesPerView: 5,
    },
    340: {
      slidesPerView: 4,
    },
    0: {
      slidesPerView: 3,
    },
  },
})

const services = document.querySelector('.services-container')

const resizeObserver = new ResizeObserver((entries) => {
  if (isExpanded) {
    return
  }

  if (
    entries[0].contentRect.height -
      document.querySelector('.service-filters').offsetHeight >
    400
  ) {
    showMore.style.visibility = 'visible'
  } else {
    showMore.style.visibility = 'hidden'
  }
})

resizeObserver.observe(services)
