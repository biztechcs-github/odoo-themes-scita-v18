odoo.define('theme_mobicraft.custom_js', function(require) {
    'use strict';
    
    $(window).on("scroll",function() {
        if ($(window).scrollTop() >= 41) {
            $('body').addClass('header-fixed');
        } else {
            $('body').removeClass('header-fixed');
        }
    });
    $(function() {
            
        $('li#customize-menu').on('click',function() {
                
            var loc = window.location.href; 
            if(/product/.test(loc)) {
                function check()
                {   
                    if (chkObject('theme_mobicraft.mobicraft_search_count_box')==true)
                    {  
                        $('[data-view-key="theme_mobicraft.mobicraft_search_count_box"]').first().addClass('o_hidden');
                        int=window.clearInterval(int);
                    }
                }

                var int=setInterval(check, 100);
            }
            if(/shop/.test(loc)) {
                function check()
                {   
                    if (chkObject('theme_mobicraft.mobicraft_search_count_box')==true)
                    {  
                        $('[data-view-key="theme_mobicraft.mobicraft_search_count_box"]').first().addClass('o_hidden');
                        int=window.clearInterval(int);
                    }
                }
                var int=setInterval(check, 100);
            }
              
        });
    });
    function chkObject(elemClass)
    {  
       return ($('[data-view-key="theme_mobicraft.mobicraft_search_count_box"]').length>=1)? true : false;
    }
    //mobile touch
    $(document).ready(function($) {
        $(".carousel").carousel();
    });
    $(document).ready(function($) {
        $('li.position-static').mouseenter(
            function(){ 
                if ($("div.o_mega_menu_container_size").length==0)
                {
                    $(this).parent().addClass('full-size-megamenu');
                    $(this).parent().closest('div.container').css("position", "static");
                }
                else
                {
                    $(this).parent().addClass('container-size-megamenu');
                    $(this).parent().closest('div.container').css("position", "relative");
                    
                }
            }
        )
        // Switched to review section
        $('p.review').on('click',function() {
            $('html,body').animate({
                scrollTop: $(this).offset().top
            }, 1800);
            $('ul#description_reviews_tabs > li > a').removeClass('active');
            $('div#description_reviews_tabs_contents > div').removeClass('active');
            $('ul#description_reviews_tabs > li:nth-child(2) > a').addClass('active');
            $('div#description_reviews_tabs_contents > div:nth-child(2)').addClass('active');
        });
        
        $('li.position-static').mouseleave(
            function(){ 
                if ($("div.o_mega_menu_container_size").length==0)
                {
                    $(this).parent().removeClass('full-size-megamenu');
                    $(this).parent().closest('div.container').css("position", "relative");
                }
                else
                {
                   $(this).parent().removeClass('container-size-megamenu');
                   $(this).parent().closest('div.container').css("position", "relative");

                }
            }
        )
        $('li.position-static').addClass('default-megamenu-class');
         $('a[data-action=customize_theme]').click(function() { 
            setTimeout(function(){ 
                if ($('.modal-body').hasClass('cstm-customized-theme') == true) 
                { 
                    $('.modal-body').parent().parent().addClass('only-cstm-theme') 
                    $('.modal-body').parent().addClass('only-cstm-theme') 
                } 
            }, 100); 
        });
        // browser window scroll (in pixels) after which the "back to top" link is shown
        var offset = 300,
            //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
            offset_opacity = 1200,
            //duration of the top scrolling animation (in ms)
            scroll_top_duration = 700,
            //grab the "back to top" link
            $back_to_top = $('.cd-top');

        //hide or show the "back to top" link
        $(window).on("scroll",function() {
            ($(this).scrollTop() > offset) ? $back_to_top.addClass('cd-is-visible'): $back_to_top.removeClass('cd-is-visible cd-fade-out');
            if ($(this).scrollTop() > offset_opacity) {
                console.log
                $back_to_top.addClass('cd-fade-out');
            }
        });

        //smooth scroll to top
        $back_to_top.on('click', function(event) {
            event.preventDefault();
            $('body,html').animate({
                scrollTop: 0,
            }, scroll_top_duration);
        });

        $('div#recommended_products_slider').owlCarousel({
            margin: 10,
            responsiveClass: true,
            items: 4,
            loop: true,
            autoPlay: 7000,
            stopOnHover: true,
            navigation: true,
            responsive: {
                0: {
                    items: 1,
                    nav: false
                },
                500: {
                    items: 2,
                    nav: false
                },
                700: {
                    items: 3,
                    margin: 10,
                    nav: false
                },
                1000: {
                    items: 4,
                    nav: false,
                    loop: false
                },
                1500: {
                    items: 4,
                    nav: false,
                    loop: false
                }
            }
        });

        // Grid/List switching code
        $(".oe_website_sale .shift_list_view").on('click',function(e) {
            $(".oe_website_sale .shift_grid_view").removeClass('active')
            $(this).addClass('active')
            $('#products_grid').addClass("list-view-box");
            $('.oe_website_sale .oe_subdescription').addClass('o_hidden');
            localStorage.setItem("product_view", "list");
        });

        $(".oe_website_sale .shift_grid_view").on('click',function(e) {
            $(".oe_website_sale .shift_list_view").removeClass('active')
            $(this).addClass('active')
            $('#products_grid').removeClass("list-view-box");
            $('.oe_website_sale .oe_subdescription').removeClass('o_hidden');
            localStorage.setItem("product_view", "grid");
        });

        if (localStorage.getItem("product_view") == 'list') {
            $(".oe_website_sale .shift_grid_view").removeClass('active')
            $(".oe_website_sale .shift_list_view").addClass('active')
            $('.oe_website_sale .oe_subdescription').addClass('o_hidden');
            $('#products_grid').addClass("list-view-box");
        }

        if (localStorage.getItem("product_view") == 'grid') {
            $(".oe_website_sale .shift_list_view").removeClass('active')
            $(".oe_website_sale .shift_grid_view").addClass('active')
            $('.oe_website_sale .oe_subdescription').removeClass('o_hidden');
            $('#products_grid').removeClass("list-view-box");
        }
        // Grid/List switching code ends

        // Switched to review section
        $('p.review').on('click',function() {
            $('body').animate({
                scrollTop: $(this).offset().top
            }, 1800);
            $('ul#description_reviews_tabs > li').removeClass('active')
            $('div#description_reviews_tabs_contents > div').removeClass('active')
            $('ul#description_reviews_tabs > li:nth-child(2)').addClass('active')
            $('div#description_reviews_tabs_contents > div:nth-child(2)').addClass('active')
        });

        // Toggle global search
        $('.static-search').on('click', function(e) {
            $('.hm-search').toggleClass("search-toggle-open")
            $("input[name='search']").focus();
        });

        $("body").on('click',function(e) {
            if (e.target.className !== "fa fa-search" && e.target.className !== "form-control" && e.target.className !== "hm-search search-toggle-open") {
                $('.hm-search').removeClass("search-toggle-open");
            }
        });

    });

    // For Megamenu
    $(document).on('click', '.mega-dropdown-menu', function(e) {
        e.stopPropagation()
    });

    $(document).ready(function() {
        $(".li-mega-menu > a .fa").on('click',function() {
            $(this).parent().parent().toggleClass("mob-open");
        });
    });

    //mobile Touch
    $(document).ready(function() {
        // Activate Carousel
        $("#myCarousel").carousel();

        // Enable Carousel Indicators
        $(".item1").on('click',function() {
            $("#myCarousel").carousel(0);
        });
        $(".item2").on('click',function() {
            $("#myCarousel").carousel(1);
        });
        $(".item3").on('click',function() {
            $("#myCarousel").carousel(2);
        });
        $(".item4").on('click',function() {
            $("#myCarousel").carousel(3);
        });

        // Enable Carousel Controls
        $(".left").on('click',function() {
            $("#myCarousel").carousel("prev");
        });
        $(".right").on('click',function() {
            $("#myCarousel").carousel("next");
        });

        $(function() {
            $('.item.active img').addClass('animated');
            $(".item.active .big").addClass("animated");
            $(".item.active .small").addClass("animated");
            $(".item.active img").addClass("animated");
            $(".item.active .banner-button").addClass("animated");
        });

    });

    $(document).ready(function() {
        $("#myCarousel").carousel({
            interval: 500,
            pause: false
        });
    });
    $(document).ready(function(){
        setTimeout(function(){
            $('.o_extra_menu_items li.dropdown-menu').css('display','none');
            $('li.o_extra_menu_items .dropdown').on('click',function(event) {
                event.stopPropagation();
                $(this).find('.dropdown-menu').slideToggle();

            });
            $('li.o_extra_menu_items li.li-mega-menu').on('click',function(event) {
                event.stopImmediatePropagation();
                $(this).find('ul.dropdown-menu').slideToggle();
            });
            $('li.o_extra_menu_items li.li-mega-menu i.fa-chevron-right').on('click',function(event) {
                event.stopPropagation();
                $('li.apt_cat_megamenu div.slide').carousel('next');
            });
            $('li.o_extra_menu_items li.li-mega-menu i.fa-chevron-left').on('click',function(event) {
                event.stopPropagation();
                $('li.apt_cat_megamenu div.slide').carousel('prev');
            });
        },500);
    });
});
