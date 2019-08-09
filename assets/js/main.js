var $animatedElems = $('.hidden'); //элементы с анимацией
var $sections = $('section');
var sectionsDomObj = $sections.get();
var $navLinks = $('.nav-link');

$(document).ready(function() { //проверяем есть ли элементы на экране сразу после загрузки страницы и в какой секции мы находимся
    scrolling();
    inWhichSection();
});

$(window).on("scroll", throttleScroll); //событие скроллинга

var isScrolling = false;

function throttleScroll() {
    if (isScrolling == false ) {
        window.requestAnimationFrame(function() {  //функция запускается при каждой смене кадра
          scrolling();
          inWhichSection();
          isScrolling = false;
        });
    }
    isScrolling = true;
};


function scrolling() {  //проверяем какие элементы попали в зону видимости после скролинга
       $animatedElems.each(function() {
           domElem = $(this).get();
           var $elem = $(this);
           if (isVisible(domElem[0], 0.6)) {
                setTimeout(function() {
                    $elem.removeClass('hidden');
                }, 0);
            }
           else $(this).addClass('hidden');
       });
};

function isVisible(elem, n) { //проверяем является ли элемент видимым на n * 100% своей высоты
    let windowBottom = window.pageYOffset + window.innerHeight; 
    var elemBoundary = elem.getBoundingClientRect();
    var top = elemBoundary.top;
    var height = elemBoundary.height;
    if ((window.pageYOffset + top + height * n) < windowBottom) {
        return true;
    }
    else return false;
};

function inWhichSection(){ //функция проверяет в какой секции мы находимся и активирует соответствующий линк навбара
    if (window.pageYOffset < 150) $('.header-navbar').css({'background-color': 'transparent', //меняем внешний вид навбара
                                                            'padding': '15px 16px'}); 
    else $('.header-navbar').css({'background-color': 'rgba(0, 0, 0, 0.8)',
                                 'padding' : '8px 16px'});

    for (let i = 0; i < sectionsDomObj.length; i++) {
        if (window.pageYOffset < 150) {
            $navLinks.removeClass('active'); 
            return;
        }
        if (i === sectionsDomObj.length - 1) { // мы в последней секции? 
            $navLinks.removeClass('active').eq(i).addClass('active');
            return;
        }
        if(isVisible(sectionsDomObj[i], 0.5) && !isVisible(sectionsDomObj[i+1], 0.5)) { //текущая секция видна, а следующая нет?
             $navLinks.removeClass('active').eq(i).addClass('active');
             return;
        }
    } 
};


$navLinks.on('click', function(event) { //обработка нажатия на ссылку навбара и определение на какую из 
    let target = event.target;
    $navLinks.each(function(index){
        if (this === target) goToSection(index);
    })
});
 
function goToSection(index){ //функция перехода в секцию
    $('html').animate({
        scrollTop: $sections.eq(index).offset().top
      }, 500);
}

$('.to-top').on('click', function() {
    $('html').animate({
        scrollTop: 0
      }, 500);
})
