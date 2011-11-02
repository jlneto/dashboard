var postboxes; (function(a) {
    postboxes = {
        add_postbox_toggles: function(c, b) {
            this.init(c, b);
            a(".postbox h3, .postbox .handlediv").click(function() {
                var e = a(this).parent(".postbox"),
                f = e.attr("id");
                if ("dashboard_browser_nag" == f) {
                    return
                }
                e.toggleClass("closed");
                postboxes.save_state(c);
                if (f) {
                    if (!e.hasClass("closed") && a.isFunction(postboxes.pbshow)) {
                        postboxes.pbshow(f)
                    } else {
                        if (e.hasClass("closed") && a.isFunction(postboxes.pbhide)) {
                            postboxes.pbhide(f)
                        }
                    }
                }
            });
            a(".postbox h3 a").click(function(f) {
                f.stopPropagation()
            });
            a(".postbox a.dismiss").click(function(g) {
                var f = a(this).parents(".postbox").attr("id") + "-hide";
                a("#" + f).prop("checked", false).triggerHandler("click");
                return false
            });
            a(".hide-postbox-tog").click(function() {
                var e = a(this).val();
                if (a(this).prop("checked")) {
                    a("#" + e).show();
                    if (a.isFunction(postboxes.pbshow)) {
                        postboxes.pbshow(e)
                    }
                } else {
                    a("#" + e).hide();
                    if (a.isFunction(postboxes.pbhide)) {
                        postboxes.pbhide(e)
                    }
                }
                postboxes.save_state(c)
            });
            a('.columns-prefs input[type="radio"]').click(function() {
                var e = a(this).val(),
                f,
                g,
                h = a("#poststuff");
                if (h.length) {
                    if (e == 2) {
                        h.addClass("has-right-sidebar");
                        a("#side-sortables").addClass("temp-border")
                    } else {
                        if (e == 1) {
                            h.removeClass("has-right-sidebar");
                            a("#normal-sortables").append(a("#side-sortables").children(".postbox"))
                        }
                    }
                } else {
                    for (f = 4; (f > e && f > 1); f--) {
                        g = a("#" + d(f) + "-sortables");
                        a("#" + d(f - 1) + "-sortables").append(g.children(".postbox"));
                        g.parent().hide()
                    }
                    for (f = 1; f <= e; f++) {
                        g = a("#" + d(f) + "-sortables");
                        if (g.parent().is(":hidden")) {
                            g.addClass("temp-border").parent().show()
                        }
                    }
                    a(".postbox-container:visible").css("width", 98 / e + "%")
                }
                postboxes.save_order(c)
            });
            function d(e) {
                switch (e) {
                case 1:
                    return "normal";
                    break;
                case 2:
                    return "side";
                    break;
                case 3:
                    return "column3";
                    break;
                case 4:
                    return "column4";
                    break;
                default:
                    return ""
                }
            }
        },
        init: function(c, b) {
            a.extend(this, b || {});
            a("#wpbody-content").css("overflow", "hidden");
            a(".meta-box-sortables").sortable({
                placeholder: "sortable-placeholder",
                connectWith: ".meta-box-sortables",
                items: ".postbox",
                handle: ".hndle",
                cursor: "move",
                distance: 2,
                tolerance: "pointer",
                forcePlaceholderSize: true,
                helper: "clone",
                opacity: 0.65,
                stop: function(f, d) {
                    if (a(this).find("#dashboard_browser_nag").is(":visible") && "dashboard_browser_nag" != this.firstChild.id) {
                        a(this).sortable("cancel");
                        return
                    }
                    postboxes.save_order(c);
                    d.item.parent().removeClass("temp-border")
                },
                receive: function(f, d) {
                    if ("dashboard_browser_nag" == d.item[0].id) {
                        a(d.sender).sortable("cancel")
                    }
                }
            })
        },
        save_state: function(d) {
            var b = a(".postbox").filter(".closed").map(function() {
                return this.id
            }).get().join(","),
            c = a(".postbox").filter(":hidden").map(function() {
                return this.id
            }).get().join(",");
            a.post(ajaxurl, {
                action: "closed-postboxes",
                closed: b,
                hidden: c,
                closedpostboxesnonce: jQuery("#closedpostboxesnonce").val(),
                page: d
            })
        },
        save_order: function(c) {
            var b,
            d = a(".columns-prefs input:checked").val() || 0;
            b = {
                action: "meta-box-order",
                _ajax_nonce: a("#meta-box-order-nonce").val(),
                page_columns: d,
                page: c
            };
            a(".meta-box-sortables").each(function() {
                b["order[" + this.id.split("-")[0] + "]"] = a(this).sortable("toArray").join(",")
            });
            a.post(ajaxurl, b)
        },
        pbshow: false,
        pbhide: false
    }
} (jQuery));
var ajaxWidgets,
ajaxPopulateWidgets,
quickPressLoad;
jQuery(document).ready(function(a) {
    ajaxWidgets = ["dashboard_incoming_links", "dashboard_primary", "dashboard_secondary", "dashboard_plugins"];
    ajaxPopulateWidgets = function(c) {
        function b(d, h) {
            var g,
            f = a("#" + h + " div.inside:visible").find(".widget-loading");
            if (f.length) {
                g = f.parent();
                setTimeout(function() {
                    g.load(ajaxurl.replace("/admin-ajax.php", "") + "/index-extra.php?jax=" + h, "",
                    function() {
                        g.hide().slideDown("normal",
                        function() {
                            a(this).css("display", "")
                        })
                    })
                },
                d * 500)
            }
        }
        if (c) {
            c = c.toString();
            if (a.inArray(c, ajaxWidgets) != -1) {
                b(0, c)
            }
        } else {
            a.each(ajaxWidgets, b)
        }
    };
    ajaxPopulateWidgets();
    postboxes.add_postbox_toggles(pagenow, {
        pbshow: ajaxPopulateWidgets
    });
    quickPressLoad = function() {
        var b = a("#quickpost-action"),
        c;
        c = a("#quick-press").submit(function() {
            a("#dashboard_quick_press #publishing-action img.waiting").css("visibility", "visible");
            a('#quick-press .submit input[type="submit"], #quick-press .submit input[type="reset"]').prop("disabled", true);
            if ("post" == b.val()) {
                b.val("post-quickpress-publish")
            }
            a("#dashboard_quick_press div.inside").load(c.attr("action"), c.serializeArray(),
            function() {
                a("#dashboard_quick_press #publishing-action img.waiting").css("visibility", "hidden");
                a('#quick-press .submit input[type="submit"], #quick-press .submit input[type="reset"]').prop("disabled", false);
                a("#dashboard_quick_press ul").next("p").remove();
                a("#dashboard_quick_press ul").find("li").each(function() {
                    a("#dashboard_recent_drafts ul").prepend(this)
                }).end().remove();
                quickPressLoad()
            });
            return false
        });
        a("#publish").click(function() {
            b.val("post-quickpress-publish")
        })
    };
    quickPressLoad()
});

