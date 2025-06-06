/** @odoo-module **/

import options from "@web_editor/js/editor/snippets.options";
import { renderToElement } from "@web/core/utils/render";
import { rpc, RPCError } from '@web/core/network/rpc';
import { _t } from "@web/core/l10n/translation";
import snippetsEditor from "@web_editor/js/editor/snippets.editor";
import { Dialog } from "@web/core/dialog/dialog";
import { CodeEditor } from "@web/core/code_editor/code_editor";
import { patch } from "@web/core/utils/patch";

patch(snippetsEditor.SnippetsMenu.prototype, {
         async start() {
            await super.start();
            this.waitForElementToDisplay("div#scita_snippets", 1000);
         },
         waitForElementToDisplay(selector,time) {
             var self = this;
             const target = document.querySelector("#theme_scita_groups");
             const parent = target?.parentElement;
             if(parent) {
                 const html = `<div id="scita_snippets" class="mt-3">\
                     <span class="fa-stack d-inline-flex mb-1 me-1">\
                         <img src="/theme_scita/static/src/img/scita_small_logo.png" class="img img-fluid" alt="Money back"/>\
                     </span>\
                     Theme Scita\
                     <select id="selSnippetCat" class="scita_snippet_sort px-2 py-1">\
                         <option value="about_us">About Us Snippets</option>\
                         <option value="accordion">Accordion Snippets</option>\
                         <option value="banner">Banner Snippets</option>\
                         <option value="blog">Blog Snippets</option>\
                         <option value="brand">Brand Snippets</option>\
                         <option value="client_snippet">Client Snippets</option>\
                         <option value="category_snippet">Category Snippets</option>\
                         <option value="case_study">Case Study Snippets</option>\
                         <option value="contact_us">Contact Us Snippets</option>\
                         <option value="deal_days">Deal of the Day Snippets</option>\
                         <option value="google_map_snippet">Google Map Snippets</option>\
                         <option value="how_it_works">How It Works Snippets</option>\
                         <option value="img_hotspot">Image Hotspot Snippets</option>\
                         <!-- <option value="html_builder">HTML Snippet Builder</option> -->\
                         <option value="multi_product">Multi Product Snippets</option>\
                                                 <t t-if="request.env['ir.module.module'].sudo().search([\
                                         ('name', '=', 'mass_mailing'),('state','=','installed')])">\
                                                 <option value="newsletter">Newsletter Snippets</option>\
                                             </t>\
                         <option value="our_team">Our Team Snippets</option>\
                         <option value="portfolio">Portfolio Snippets</option>\
                         <option value="advbanner">Promotion Snippets</option>\
                         <option value="pricing_table">Pricing Snippets</option>\
                         <option value="statistics">Statistics Snippets</option>\
                         <option value="service">Service Snippets</option>\
                         <option value="trust_icon">Trust Icons Snippets</option>\
                         <option value="testimonial">Testimonial Snippets</option>\
                         <option value="timeline">Timeline Snippets</option>\
                     </select>\
                 </div>`
                 parent.innerHTML = html + parent.innerHTML;
             }
             if(document.querySelector(selector)!=null && target!=null) {
                $(
                    "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                    "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                    "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                    "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                    "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                    "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                    "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                    "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                    "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                    "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                    "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                    "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                    "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                    "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                    "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                    "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                    "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                    "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                    "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                    "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                    "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                    "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                    "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                    "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                    "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                    "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                    "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                    "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                    "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                    "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                ).parent().addClass("o_hidden");
                $("#theme_scita_groups [data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4], [data-snippet=about_us_v_5],[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10] , [data-snippet=content_snippets_v_11]").parent().removeClass("o_hidden")

                 $("select#selSnippetCat").on('change',function(){
                     if($("select#selSnippetCat").val()=='banner')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=sct_banner_1], [data-snippet=sct_banner_2], [data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2], [data-snippet=dynamic_video_banner]").parent().removeClass("o_hidden")

                     }
                     else if($("select#selSnippetCat").val()=='newsletter')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=it_sign_up_newsletter], [data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='deal_days')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3], [data-snippet=deal_of_day_banner_5]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='blog')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet], [data-snippet=blog_5_custom_snippet]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='our_team')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=it_our_team], [data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='testimonial')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=health_testimonials_slider_1], [data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1], [data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4], [data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='service')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=it_grids_service], [data-snippet=service_varient_7], [data-snippet=service_varient_11], [data-snippet=service_varient_14]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='portfolio')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=portfolio_snippet_1], [data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets]").parent().removeClass("o_hidden")

                     }
                     else if($("select#selSnippetCat").val()=='advbanner')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=health_advertisement_banner], [data-snippet=fashion_advertisement_banner_1], [data-snippet=retial_advertisement_banner_1], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3]").parent().removeClass("o_hidden")



                     }
                     else if($("select#selSnippetCat").val()=='pricing_table')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_4column_v4], [data-snippet=s_theme_scita_pricing_table_1_3column_v5]").parent().removeClass("o_hidden")



                     }
                     else if($("select#selSnippetCat").val()=='trust_icon')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=retial_trust_snippet_1], [data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='contact_us')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=it_letstalk], [data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet]").parent().removeClass("o_hidden")



                     }
                     else if($("select#selSnippetCat").val()=='how_it_works')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3], [data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='statistics')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=expertise_statistics_4], [data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11]").parent().removeClass("o_hidden")


                     }
                   
                     else if($("select#selSnippetCat").val()=='client_snippet')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='category_snippet')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=custom_scita_product_category_slider], [data-snippet=product_category_img_slider_config], [data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=theme_scita_category_slider_gray]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='case_study')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=health_cash_study_snippet], [data-snippet=case_study_varient_2]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='brand')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='about_us')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4], [data-snippet=about_us_v_5], [data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10] , [data-snippet=content_snippets_v_11]").parent().removeClass("o_hidden")



                     }
                     else if($("select#selSnippetCat").val()=='accordion')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=accordion_v_1], [data-snippet=accordion_v_2]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='timeline')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3]").parent().removeClass("o_hidden")


                     }

                     else if($("select#selSnippetCat").val()=='multi_product')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6], [data-snippet=theme_scita_trending_products_snippet] , [data-snippet=sct_product_snippet_1]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='google_map_snippet')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content]").parent().removeClass("o_hidden")


                     }
                     else if($("select#selSnippetCat").val()=='html_builder')
                     {
                        $(
                            "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                            "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                            "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                            "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                            "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                            "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                            "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                            "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                            "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                            "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                            "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                            "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                            "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                            "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                            "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                            "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                            "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                            "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                            "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                            "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                            "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                            "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                            "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                            "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                            "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                            "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                            "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                            "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                            "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                        ).parent().addClass("o_hidden");
                        $("#theme_scita_groups [data-snippet=html_builder_snippet]").parent().removeClass("o_hidden")

                     }
                     else if($("select#selSnippetCat").val()=='img_hotspot')
                        {
                           $(
                               "#theme_scita_groups [data-snippet=timer_snippet_body], [data-snippet=sct_banner_1], [data-snippet=sct_banner_2],\n" +
                               "[data-snippet=retail_sct_banner_slider_1], [data-snippet=it_main_banner], [data-snippet=banner_snippet_2],\n" +
                               "[data-snippet=dynamic_video_banner], [data-snippet=retial_deal_of_day_banner_snippet_1], [data-snippet=deal_of_day_banner_3],\n" +
                               "[data-snippet=deal_of_day_banner_5], [data-snippet=retial_promo_banner_snippet_1], [data-snippet=promo_banner_snippet_3],\n" +
                               "[data-snippet=fashion_multi_cat_custom_snippet], [data-snippet=deal_seller_multi_product_custom_snippet], [data-snippet=deal_of_day_banner_6],\n" +
                               "[data-snippet=brands_box_slider_4], [data-snippet=it_prod_brands], [data-snippet=fashion_static_brand_snippet],\n" +
                               "[data-snippet=theme_scita_category_slider_3], [data-snippet=theme_scita_category_slider_4], [data-snippet=retial_advertisement_banner_1],\n" +
                               "[data-snippet=fashion_advertisement_banner_1], [data-snippet=health_advertisement_banner], [data-snippet=health_testimonials_slider_1],\n" +
                               "[data-snippet=testinomial_varient_2], [data-snippet=fashion_testimonials_slider_1], [data-snippet=it_testimonials_slider_1],\n" +
                               "[data-snippet=testinomial_varient_1], [data-snippet=testinomial_varient_3], [data-snippet=testinomial_varient_4],\n" +
                               "[data-snippet=testinomial_varient_5], [data-snippet=testinomial_varient_6], [data-snippet=health_cash_study_snippet],\n" +
                               "[data-snippet=case_study_varient_2], [data-snippet=it_grids_service], [data-snippet=service_varient_7],\n" +
                               "[data-snippet=service_varient_11], [data-snippet=service_varient_14], [data-snippet=s_theme_scita_pricing_table_1_4column_v4],\n" +
                               "[data-snippet=s_theme_scita_pricing_table_1_4column_v2], [data-snippet=s_theme_scita_pricing_table_1_3column_v5], [data-snippet=it_our_team],\n" +
                               "[data-snippet=our_team_varient_3], [data-snippet=our_team_varient_5], [data-snippet=retial_trust_snippet_1],\n" +
                               "[data-snippet=fashion_trust_snippet_1], [data-snippet=policy_trust_snippet_v_3], [data-snippet=sct_product_snippet_1],\n" +
                               "[data-snippet=theme_scita_trending_products_snippet], [data-snippet=how_it_work_v_1], [data-snippet=how_it_work_v_3],\n" +
                               "[data-snippet=how_it_work_v_4], [data-snippet=how_it_work_v_5], [data-snippet=expertise_statistics_4],\n" +
                               "[data-snippet=expertise_statistics_8], [data-snippet=expertise_statistics_11], [data-snippet=it_letstalk],\n" +
                               "[data-snippet=contact_us_v_1], [data-snippet=contact_us_v_3], [data-snippet=health_location_snippet],\n" +
                               "[data-snippet=content_snippets_v_4], [data-snippet=content_snippets_v_6], [data-snippet=content_snippets_v_10],[data-snippet=content_snippets_v_11],\n" +
                               "[data-snippet=health_about_hospital], [data-snippet=about_us_v_3], [data-snippet=about_us_v_4],\n" +
                               "[data-snippet=about_us_v_5], [data-snippet=accordion_v_1], [data-snippet=accordion_v_2],\n" +
                               "[data-snippet=s_appjetty_google_map], [data-snippet=s_appjetty_google_map_content],\n" +
                               "[data-snippet=theme_scita_blog_custom_snippet], [data-snippet=blog_4_custom_snippet], [data-snippet=blog_2_custom_snippet],\n" +
                               "[data-snippet=blog_5_custom_snippet], [data-snippet=third_client_slider_snippet], [data-snippet=theme_scita_top_dealers_snippet],\n" +
                               "[data-snippet=s_theme_scita_category_slider], [data-snippet=theme_scita_category_slider_gray], [data-snippet=product_category_img_slider_config],\n" +
                               "[data-snippet=timeline_snippet_1], [data-snippet=timeline_snippet_3], [data-snippet=portfolio_snippet_1],\n" +
                               "[data-snippet=portfolio_snippet_2], [data-snippet=it_portfolio_tabs_snippets], [data-snippet=it_sign_up_newsletter],\n" +
                               "[data-snippet=retail_sign_up_newsletter], [data-snippet=newsletter_varient_5],[data-snippet=theme_scita_image_hotspot]"
                           ).parent().addClass("o_hidden");
                           $("#theme_scita_groups [data-snippet=theme_scita_image_hotspot]").parent().removeClass("o_hidden")
   
                        }
                 });
                 return;
             }
             else {
                 setTimeout(function() {
                     self.waitForElementToDisplay(selector, time);
                 }, time);
             }
         },
     });

    options.registry.oe_cat_slider = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find(".oe_cat_slider").empty();
            if (!editMode) {
                self.$el.find(".oe_cat_slider").on("click", $.bind(self.cat_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.cat_slider()) {
                this.cat_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.oe_cat_slider').empty();
        },

        cat_slider: function(type, value) {
            var self = this;
            
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_dynamic_category_slider"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $category_slider_delete = self.$modal.find("#cancel"),
                    $pro_cat_sub_data = self.$modal.find("#cat_sub_data");
                rpc('/theme_scita/category_get_options', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $pro_cat_sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-cat-slider-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Category Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $category_slider_delete.on('click', function() {
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });

    //image hotspot
    options.registry.oe_img_hotspot = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find(".oe_img_hotspot").empty();
            if (!editMode) {
                self.$el.find(".oe_img_hotspot").on("click", $.bind(self.img_hotspot, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.img_hotspot()) {
                this.img_hotspot().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.oe_img_hotspot').empty();
        },

        img_hotspot: function(type, value) {
            var self = this;
            
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_dynamic_image_hotspot"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                $category_slider_delete = self.$modal.find("#cancel"),
                $pro_cat_sub_data = self.$modal.find("#img_data_hp");
                rpc('/theme_scita/hotspot', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $pro_cat_sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-img-hotspot-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Image Hotspot");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $category_slider_delete.on('click', function() {
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });

    options.registry.theme_scita_product_slider = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("hidden");
            this.$target.find(".oe_prod_slider").empty();
            if (!editMode) {
                self.$el.find(".oe_prod_slider").on("click", $.bind(self.prod_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.prod_slider()) {
                this.prod_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.oe_prod_slider').empty();
        },

        prod_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                
                self.$modal = $(renderToElement("theme_scita.scita_dynamic_product_slider"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $product_slider_cancel = self.$modal.find("#cancel"),
                    $pro_sub_data = self.$modal.find("#prod_sub_data");

                rpc('/theme_scita/product_get_options', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $pro_sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-prod-slider-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Product Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $product_slider_cancel.on('click', function() {
                    self.getParent()._onRemoveClick($.Event("click"))
                });
            } else {
                return;
            }
        },
    });
    options.registry.fashion_multi_cat_custom_snippet = options.Class.extend({

        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("hidden");
            this.$target.find('.fashion_multi_category_slider .owl-carousel').empty();
            if (!editMode) {
                self.$el.find(".fashion_multi_category_slider").on("click", $.bind(self.multi_category_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.multi_category_slider()) {
                this.multi_category_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.fashion_multi_category_slider .owl-carousel').empty();
        },

        multi_category_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.multi_product_custom_slider_block"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $cancel = self.$modal.find("#cancel"),
                    $snippnet_submit = self.$modal.find("#snippnet_submit");

                rpc('/theme_scita/product_multi_get_options', {}).then(function(res) {
                    $("select[id='slider_type'] option").remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $snippnet_submit.on('click', function() {
                    // var type = '';
                    self.$target.attr('data-multi-cat-slider-type', $slider_type.val());
                    self.$target.attr('data-multi-cat-slider-id', 'multi-cat-myowl' + $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        var type = '';
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        var type = '';
                        type = _t("Multi Product Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="row our-categories">\
                                                        <div class="col-md-12">\
                                                            <div class="title-block">\
                                                                <h4 class="section-title style1">\
                                                                    <span>' + type + '</span>\
                                                                </h4>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                });
            } else {
                return;
            }
        },
    });
    // box Brand 
    options.registry.brands_box_slider_4 = options.Class.extend({

        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("hidden");
            this.$target.find(".box_brand_slider .owl-carousel").empty();

            if (!editMode) {
                self.$el.find(".box_brand_slider").on("click", $.bind(self.box_brand_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.box_brand_slider()) {
                this.box_brand_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.box_brand_slider .owl-carousel').empty();
        },

        box_brand_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_brand_configration"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $cancel = self.$modal.find("#cancel"),
                    $brand_sub_data = self.$modal.find("#pro_brand_sub_data");

                rpc('/theme_scita/brand_get_options', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $brand_sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-brand-config-type', $slider_type.val());
                    self.$target.attr('data-brand-config-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Brand snippet");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="row oe_our_slider">\
                                                        <div class="col-md-12">\
                                                            <div class="title-block">\
                                                                <h4 class="section-title style1">\
                                                                    <span>' + type + '</span>\
                                                                </h4>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                });
            } else {
                return;
            }
        },
    });
    // for brand slider
    options.registry.it_prod_brands = options.Class.extend({

        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find(".it_brand_slider").empty();
            if (!editMode) {
                self.$el.find(".it_brand_slider").on("click", $.bind(self.brand_it_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.brand_it_slider()) {
                this.brand_it_slider().fail(function() {
                    self.getParent()._removeSnippet();

                });
            }
        },
        cleanForSave: function() {
            $('.it_brand_slider .owl-carousel').empty();
        },

        brand_it_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_brand_configration"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $cancel = self.$modal.find("#cancel"),
                    $brand_sub_data = self.$modal.find("#pro_brand_sub_data");

                rpc('/theme_scita/brand_get_options', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $brand_sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-brand-config-type', $slider_type.val());
                    self.$target.attr('data-brand-config-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Our Brands");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="row oe_our_slider">\
                                                        <div class="col-md-12">\
                                                            <div class="title-block">\
                                                                <h4 class="section-title style1">\
                                                                    <span>' + type + '</span>\
                                                                </h4>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                });
            } else {
                return;
            }
        },

    });

    options.registry.theme_scita_blog_custom_snippet = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find('.scita_blog_slider').empty();
           
            if (!editMode) {
                self.$el.find(".scita_blog_slider").on("click", $.bind(self.theme_scita_blog_slider, self));
            }
        },
        onBuilt: function() {
            var self = this;
            this._super();
            if (this.theme_scita_blog_slider()) {
                this.theme_scita_blog_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },
        cleanForSave: function() {
            $('.scita_blog_slider').empty();
        },
        theme_scita_blog_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_blog_slider_block"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#blog_slider_type"),
                    $blog_slider_cancel = self.$modal.find("#cancel"),
                    $sub_data = self.$modal.find("#blog_sub_data");
                rpc('/theme_scita/blog_get_options', {}).then(function(res) {
                    $('#blog_slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='blog_slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });
                $sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-blog-slider-type', $slider_type.val());
                    self.$target.attr('data-blog-slider-id', 'blog-myowl' + $slider_type.val());
                    if ($('select#blog_slider_type').find(":selected").text()) {
                        type = _t($('select#blog_slider_type').find(":selected").text());
                    } else {
                        type = _t("Blog Post Slider");
                    }
                    
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $blog_slider_cancel.on('click', function() {
                    // self.$modal.modal('hide')
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });
    options.registry.blog_2_custom_snippet = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find('.blog_2_custom').empty();
            
            if (!editMode) {
                self.$el.find(".blog_2_custom").on("click", $.bind(self.theme_scita_blog_slider, self));
            }
        },
        onBuilt: function() {
            var self = this;
            this._super();
            if (this.theme_scita_blog_slider()) {
                this.theme_scita_blog_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },
        cleanForSave: function() {
            $('.blog_2_custom').empty();
        },
        theme_scita_blog_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_blog_slider_block"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#blog_slider_type"),
                    $blog_slider_cancel = self.$modal.find("#cancel"),
                    $sub_data = self.$modal.find("#blog_sub_data");

                rpc('/theme_scita/blog_get_options', {}).then(function(res) {
                    $('#blog_slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='blog_slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });
                $sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-blog-slider-type', $slider_type.val());
                    self.$target.attr('data-blog-slider-id', 'blog-myowl' + $slider_type.val());
                    if ($('select#blog_slider_type').find(":selected").text()) {
                        type = _t($('select#blog_slider_type').find(":selected").text());
                    } else {
                        type = _t("Blog Post Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $blog_slider_cancel.on('click', function() {
                    // self.$modal.modal('hide')
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });
    options.registry.blog_4_custom_snippet = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find('.blog_4_custom').empty();
           
            if (!editMode) {
                self.$el.find(".blog_4_custom").on("click", $.bind(self.theme_scita_blog_slider, self));
            }
        },
        onBuilt: function() {
            var self = this;
            this._super();
            if (this.theme_scita_blog_slider()) {
                this.theme_scita_blog_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },
        cleanForSave: function() {
            $('.blog_4_custom').empty();
        },
        theme_scita_blog_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_blog_slider_block"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#blog_slider_type"),
                    $blog_slider_cancel = self.$modal.find("#cancel"),
                    $sub_data = self.$modal.find("#blog_sub_data");

                rpc('/theme_scita/blog_get_options', {}).then(function(res) {
                    $('#blog_slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='blog_slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });
                $sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-blog-slider-type', $slider_type.val());
                    self.$target.attr('data-blog-slider-id', 'blog-myowl' + $slider_type.val());
                    if ($('select#blog_slider_type').find(":selected").text()) {
                        type = _t($('select#blog_slider_type').find(":selected").text());
                    } else {
                        type = _t("Blog Post Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $blog_slider_cancel.on('click', function() {
                    // self.$modal.modal('hide')
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });
    options.registry.blog_5_custom_snippet = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find('.blog_5_custom').empty();
            if (!editMode) {
                self.$el.find(".blog_5_custom").on("click", $.bind(self.theme_scita_blog_slider, self));
            }
        },
        onBuilt: function() {
            var self = this;
            this._super();
            if (this.theme_scita_blog_slider()) {
                this.theme_scita_blog_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },
        cleanForSave: function() {
            $('.blog_5_custom').empty();
        },
        theme_scita_blog_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_blog_slider_block"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#blog_slider_type"),
                    $blog_slider_cancel = self.$modal.find("#cancel"),
                    $sub_data = self.$modal.find("#blog_sub_data");

                rpc('/theme_scita/blog_get_options', {}).then(function(res) {
                    $('#blog_slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='blog_slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });
                $sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-blog-slider-type', $slider_type.val());
                    self.$target.attr('data-blog-slider-id', 'blog-myowl' + $slider_type.val());
                    if ($('select#blog_slider_type').find(":selected").text()) {
                        type = _t($('select#blog_slider_type').find(":selected").text());
                    } else {
                        type = _t("Blog Post Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $blog_slider_cancel.on('click', function() {
                    // self.$modal.modal('hide')
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });
    options.registry.cat_slider_3 = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find(".cat_slider_3").empty();
            if (!editMode) {
                self.$el.find(".cat_slider_3").on("click", $.bind(self.cat_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.cat_slider()) {
                this.cat_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.cat_slider_3').empty();
        },

        cat_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_dynamic_category_slider"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $category_slider_delete = self.$modal.find("#cancel"),
                    $pro_cat_sub_data = self.$modal.find("#cat_sub_data");
                rpc('/theme_scita/category_get_options', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $pro_cat_sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-cat-slider-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Category Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $category_slider_delete.on('click', function() {
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });

    options.registry.cat_slider_4 = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find(".cat_slider_4").empty();
            if (!editMode) {
                self.$el.find(".cat_slider_4").on("click", $.bind(self.cat_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.cat_slider()) {
                this.cat_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.cat_slider_4').empty();
        },

        cat_slider: function(type, value) {
            var self = this;
            
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_dynamic_category_slider"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $category_slider_delete = self.$modal.find("#cancel"),
                    $pro_cat_sub_data = self.$modal.find("#cat_sub_data");
                rpc('/theme_scita/category_get_options', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $pro_cat_sub_data.on('click', function() {
                    var type = '';
                    self.$target.attr('data-cat-slider-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Category Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="block-title">\
                                                        <h3 class="fancy">' + type + '</h3>\
                                                    </div>\
                                                </div>');
                });
                $category_slider_delete.on('click', function() {
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });
    //  brand and product/category snippet end
    options.registry.product_category_img_slider_config = options.Class.extend({

        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("hidden");
            this.$target.find('.multi_product_and_category_slider .owl-carousel').empty();
            if (!editMode) {
                self.$el.find(".multi_product_and_category_slider").on("click", $.bind(self.multi_category_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.multi_category_slider()) {
                this.multi_category_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.multi_product_and_category_slider .owl-carousel').empty();
        },

        multi_category_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_product_category_img_slider_config"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $cancel = self.$modal.find("#cancel"),
                    $snippnet_submit = self.$modal.find("#snippnet_submit");
                rpc('/theme_scita/product_category_slider', {}).then(function(res) {
                    $("select[id='slider_type'] option").remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $snippnet_submit.on('click', function() {
                    self.$target.attr('data-multi-cat-slider-type', $slider_type.val());
                    self.$target.attr('data-multi-cat-slider-id', 'multi-cat-myowl' + $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        var type = '';
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        var type = '';
                        type = _t("Image Product/Category Snippet");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="row our-categories">\
                                                        <div class="col-md-12">\
                                                            <div class="title-block">\
                                                                <h4 class="section-title style1">\
                                                                    <span>' + type + '</span>\
                                                                </h4>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                });
            } else {
                return;
            }
        },
    });





    options.registry.sct_product_snippet_1 = options.Class.extend({

        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("hidden");
            this.$target.find('.sct_product_snippet_1 .owl-carousel').empty();
            if (!editMode) {
                self.$el.find(".sct_product_snippet_1").on("click", $.bind(self.multi_category_slider, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.multi_category_slider()) {
                this.multi_category_slider().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.sct_product_snippet_1 .owl-carousel').empty();
        },

        multi_category_slider: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_dynamic_product_snippet_configuration"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $cancel = self.$modal.find("#cancel"),
                    $snippnet_submit = self.$modal.find("#snippnet_submit");
                rpc('/theme_scita/product_configuration', {}).then(function(res) {
                    $("select[id='slider_type'] option").remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $snippnet_submit.on('click', function() {
                    self.$target.attr('data-multi-cat-slider-type', $slider_type.val());
                    self.$target.attr('data-multi-cat-slider-id', 'multi-cat-myowl' + $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        var type = '';
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        var type = '';
                        type = _t("Multi Product Slider");
                    }
                    self.$target.empty().append('<div class="container">\
                                                    <div class="row our-categories">\
                                                        <div class="col-md-12">\
                                                            <div class="title-block">\
                                                                <h4 class="section-title style1">\
                                                                    <span>' + type + '</span>\
                                                                </h4>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                });
            } else {
                return;
            }
        },
    });
    // Dynamic Video banner js start
    options.registry.dynamic_video_banner = options.Class.extend({

        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("hidden");
            this.$target.find(".dynamic_video_banner").empty();

            if (!editMode) {
                self.$el.find(".dynamic_video_banner").on("click", $.bind(self.dynamic_video_banner, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.dynamic_video_banner()) {
                this.dynamic_video_banner().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.dynamic_video_banner').empty();
        },

        dynamic_video_banner: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.video_banner_block"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var modification = this.$target.html()
                var $video_url = self.$modal.find("#video-url"),
                    $cancel = self.$modal.find("#cancel"),
                    $sub_data = self.$modal.find("#video_sub_data");
                $video_url.val(self.$target.attr('data-video-url'));
                $sub_data.on('click', function() {
                    var type = _t("Video Banner");

                    self.$target.attr("data-video-url", $video_url.val());

                    self.$target.empty().append('<div class="container">\
                                                    <div class="row our-brands">\
                                                        <div class="col-md-12">\
                                                            <div class="title-block">\
                                                                <h4 class="section-title style1">\
                                                                    <span>' + type + '</span>\
                                                                </h4>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>');
                });
            } else {
                return;
            }
        },
    });
    options.registry.animaion_effect = options.Class.extend({
        start: function () {
            var self = this;
            if(this.$target.parent().attr('class') != undefined)
            {
                var parentclassName = this.$target.parent().attr('class').match("sct_img_effect(.)")
                if(parentclassName){
                    this.$target.addClass(parentclassName[0]);
                }    
            }
            return this._super.apply(this, arguments);
        },
        _computeWidgetState(methodName, params) {
            this.$target.parent().removeClass('sct_img_effect1 sct_img_effect2 sct_img_effect3 sct_img_effect4 sct_img_effect5')
            if(this.$target.attr('class') != undefined)
            {
                var newclassName = this.$target.attr('class').match("sct_img_effect(.)");
                if(newclassName){
                    this.$target.parent().addClass(newclassName[0])
                    this.$target.addClass(newclassName[0])
                }    
            }
            return this._super(...arguments);
        },
    });
    // Animation effects for Theme js End
    // Trending Products Start
    options.registry.theme_scita_trending_products = options.Class.extend({
        start: function(editMode) {
            var self = this;
            this._super();
            this.$target.removeClass("o_hidden");
            this.$target.find(".theme_scita_trending_products").empty();
            if (!editMode) {
                self.$el.find(".theme_scita_trending_products").on("click", $.bind(self.trending_products, self));
            }
        },

        onBuilt: function() {
            var self = this;
            this._super();
            if (this.trending_products()) {
                this.trending_products().fail(function() {
                    self.getParent()._removeSnippet();
                });
            }
        },

        cleanForSave: function() {
            $('.theme_scita_trending_products').empty();
        },

        trending_products: function(type, value) {
            var self = this;
            if (type != undefined && type == false || type == undefined) {
                self.$modal = $(renderToElement("theme_scita.scita_trending_products_modal"));
                self.$modal.appendTo('body');
                self.$modal.modal('show');
                var $slider_type = self.$modal.find("#slider_type"),
                    $trending_products_category_delete = self.$modal.find("#cancel"),
                    $trending_category_data_submit = self.$modal.find("#trending_category_data_submit");
                rpc('/theme_scita/trending_category_get_options', {}).then(function(res) {
                    $('#slider_type option[value!="0"]').remove();
                    $.each(res, function(y) {
                        $("select[id='slider_type']").append($('<option>', {
                            value: res[y]["id"],
                            text: res[y]["name"]
                        }));
                    });
                });

                $trending_category_data_submit.on('click', function() {
                    var type = '';
                    // self.$target.attr('data-cat-slider-type', $slider_type.val());
                    self.$target.attr('data-cat-slider-id', $slider_type.val());
                    if ($('select#slider_type').find(":selected").text()) {
                        type = _t($('select#slider_type').find(":selected").text());
                    } else {
                        type = _t("Trending Products");
                    }
                    self.$target.empty().append('<div class="retail_trending_products">\
                                                    <div class="container">\
                                                        <div class="lns-inner latest-trendy-section">\
                                                            <div class="row">\
                                                                <div class="lns-post">\
                                                                    <div class="psb-inner">\
                                                                        <div class="title-block ">\
                                                                            <h2 class="section-title style1">' + type +
                                                                            '</h2>\
                                                                        </div>\
                                                                    </div>\
                                                                </div>\
                                                            </div>\
                                                        </div>\
                                                    </div>\
                                                </div>')
                });
                $trending_products_category_delete.on('click', function() {
                    self.getParent()._onRemoveClick($.Event("click"))
                })
            } else {
                return;
            }
        },
    });