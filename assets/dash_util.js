(function(a) {
    a.fn.hoverIntent = function(l, j) {
        var m = {
            sensitivity: 7,
            interval: 100,
            timeout: 0
        };
        m = a.extend(m, j ? {
            over: l,
            out: j
        }: l);
        var o,
        n,
        h,
        d;
        var e = function(f) {
            o = f.pageX;
            n = f.pageY
        };
        var c = function(g, f) {
            f.hoverIntent_t = clearTimeout(f.hoverIntent_t);
            if ((Math.abs(h - o) + Math.abs(d - n)) < m.sensitivity) {
                a(f).unbind("mousemove", e);
                f.hoverIntent_s = 1;
                return m.over.apply(f, [g])
            } else {
                h = o;
                d = n;
                f.hoverIntent_t = setTimeout(function() {
                    c(g, f)
                },
                m.interval)
            }
        };
        var i = function(g, f) {
            f.hoverIntent_t = clearTimeout(f.hoverIntent_t);
            f.hoverIntent_s = 0;
            return m.out.apply(f, [g])
        };
        var b = function(q) {
            var f = this;
            var g = (q.type == "mouseover" ? q.fromElement: q.toElement) || q.relatedTarget;
            while (g && g != this) {
                try {
                    g = g.parentNode
                } catch(q) {
                    g = this
                }
            }
            if (g == this) {
                if (a.browser.mozilla) {
                    if (q.type == "mouseout") {
                        f.mtout = setTimeout(function() {
                            k(q, f)
                        },
                        30)
                    } else {
                        if (f.mtout) {
                            f.mtout = clearTimeout(f.mtout)
                        }
                    }
                }
                return
            } else {
                if (f.mtout) {
                    f.mtout = clearTimeout(f.mtout)
                }
                k(q, f)
            }
        };
        var k = function(p, f) {
            var g = jQuery.extend({},
            p);
            if (f.hoverIntent_t) {
                f.hoverIntent_t = clearTimeout(f.hoverIntent_t)
            }
            if (p.type == "mouseover") {
                h = g.pageX;
                d = g.pageY;
                a(f).bind("mousemove", e);
                if (f.hoverIntent_s != 1) {
                    f.hoverIntent_t = setTimeout(function() {
                        c(g, f)
                    },
                    m.interval)
                }
            } else {
                a(f).unbind("mousemove", e);
                if (f.hoverIntent_s == 1) {
                    f.hoverIntent_t = setTimeout(function() {
                        i(g, f)
                    },
                    m.timeout)
                }
            }
        };
        return this.mouseover(b).mouseout(b)
    }
})(jQuery);
var showNotice,
adminMenu,
columns,
validateForm,
screenMeta; (function(a) {
    adminMenu = {
        init: function() {
            var b = a("#adminmenu");
            a(".wp-menu-toggle", b).each(function() {
                var c = a(this),
                d = c.siblings(".wp-submenu");
                if (d.length) {
                    c.click(function() {
                        adminMenu.toggle(d)
                    })
                } else {
                    c.hide()
                }
            });
            this.favorites();
            a("#collapse-menu", b).click(function() {
                if (a("body").hasClass("folded")) {
                    adminMenu.fold(1);
                    deleteUserSetting("mfold")
                } else {
                    adminMenu.fold();
                    setUserSetting("mfold", "f")
                }
                return false
            });
            if (a("body").hasClass("folded")) {
                this.fold()
            }
        },
        restoreMenuState: function() {},
        toggle: function(b) {
            b.slideToggle(150,
            function() {
                var c = b.css("display", "").parent().toggleClass("wp-menu-open").attr("id");
                if (c) {
                    a("li.wp-has-submenu", "#adminmenu").each(function(f, g) {
                        if (c == g.id) {
                            var d = a(g).hasClass("wp-menu-open") ? "o": "c";
                            setUserSetting("m" + f, d)
                        }
                    })
                }
            });
            return false
        },
        fold: function(b) {
            if (b) {
                a("body").removeClass("folded");
                a("#adminmenu li.wp-has-submenu").unbind()
            } else {
                a("body").addClass("folded");
                a("#adminmenu li.wp-has-submenu").hoverIntent({
                    over: function(j) {
                        var d,
                        c,
                        g,
                        k,
                        i;
                        d = a(this).find(".wp-submenu");
                        c = a(this).offset().top + d.height() + 1;
                        g = a("#wpwrap").height();
                        k = 60 + c - g;
                        i = a(window).height() + a(window).scrollTop() - 15;
                        if (i < (c - k)) {
                            k = c - i
                        }
                        if (k > 1) {
                            d.css({
                                marginTop: "-" + k + "px"
                            })
                        } else {
                            if (d.css("marginTop")) {
                                d.css({
                                    marginTop: ""
                                })
                            }
                        }
                        d.addClass("sub-open")
                    },
                    out: function() {
                        a(this).find(".wp-submenu").removeClass("sub-open")
                    },
                    timeout: 220,
                    sensitivity: 8,
                    interval: 100
                })
            }
        },
        favorites: function() {
            a("#favorite-inside").width(a("#favorite-actions").width() - 4);
            a("#favorite-toggle, #favorite-inside").bind("mouseenter",
            function() {
                a("#favorite-inside").removeClass("slideUp").addClass("slideDown");
                setTimeout(function() {
                    if (a("#favorite-inside").hasClass("slideDown")) {
                        a("#favorite-inside").slideDown(100);
                        a("#favorite-first").addClass("slide-down")
                    }
                },
                200)
            }).bind("mouseleave",
            function() {
                a("#favorite-inside").removeClass("slideDown").addClass("slideUp");
                setTimeout(function() {
                    if (a("#favorite-inside").hasClass("slideUp")) {
                        a("#favorite-inside").slideUp(100,
                        function() {
                            a("#favorite-first").removeClass("slide-down")
                        })
                    }
                },
                300)
            })
        }
    };
    a(document).ready(function() {
        adminMenu.init()
    });
    columns = {
        init: function() {
            var b = this;
            a(".hide-column-tog", "#adv-settings").click(function() {
                var d = a(this),
                c = d.val();
                if (d.prop("checked")) {
                    b.checked(c)
                } else {
                    b.unchecked(c)
                }
                columns.saveManageColumnsState()
            })
        },
        saveManageColumnsState: function() {
            var b = this.hidden();
            a.post(ajaxurl, {
                action: "hidden-columns",
                hidden: b,
                screenoptionnonce: a("#screenoptionnonce").val(),
                page: pagenow
            })
        },
        checked: function(b) {
            a(".column-" + b).show();
            this.colSpanChange( + 1)
        },
        unchecked: function(b) {
            a(".column-" + b).hide();
            this.colSpanChange( - 1)
        },
        hidden: function() {
            return a(".manage-column").filter(":hidden").map(function() {
                return this.id
            }).get().join(",")
        },
        useCheckboxesForHidden: function() {
            this.hidden = function() {
                return a(".hide-column-tog").not(":checked").map(function() {
                    var b = this.id;
                    return b.substring(b, b.length - 5)
                }).get().join(",")
            }
        },
        colSpanChange: function(b) {
            var d = a("table").find(".colspanchange"),
            c;
            if (!d.length) {
                return
            }
            c = parseInt(d.attr("colspan"), 10) + b;
            d.attr("colspan", c.toString())
        }
    };
    a(document).ready(function() {
        columns.init()
    });
    validateForm = function(b) {
        return ! a(b).find(".form-required").filter(function() {
            return a("input:visible", this).val() == ""
        }).addClass("form-invalid").find("input:visible").change(function() {
            a(this).closest(".form-invalid").removeClass("form-invalid")
        }).size()
    };
    showNotice = {
        warn: function() {
            var b = commonL10n.warnDelete || "";
            if (confirm(b)) {
                return true
            }
            return false
        },
        note: function(b) {
            alert(b)
        }
    };
    screenMeta = {
        links: {
            "screen-options-link-wrap": "screen-options-wrap",
            "contextual-help-link-wrap": "contextual-help-wrap"
        },
        init: function() {
            a(".screen-meta-toggle").click(screenMeta.toggleEvent)
        },
        toggleEvent: function(c) {
            var b;
            c.preventDefault();
            if (!screenMeta.links[this.id]) {
                return
            }
            b = a("#" + screenMeta.links[this.id]);
            if (b.is(":visible")) {
                screenMeta.close(b, a(this))
            } else {
                screenMeta.open(b, a(this))
            }
        },
        open: function(b, c) {
            a(".screen-meta-toggle").not(c).css("visibility", "hidden");
            b.slideDown("fast",
            function() {
                c.addClass("screen-meta-active")
            })
        },
        close: function(b, c) {
            b.slideUp("fast",
            function() {
                c.removeClass("screen-meta-active");
                a(".screen-meta-toggle").css("visibility", "")
            })
        }
    };
    a(document).ready(function() {
        var i = false,
        b,
        f,
        e,
        d,
        h,
        g = a('input[name="paged"]'),
        c;
        a("div.wrap h2:first").nextAll("div.updated, div.error").addClass("below-h2");
        a("div.updated, div.error").not(".below-h2, .inline").insertAfter(a("div.wrap h2:first"));
        screenMeta.init();
        h = {
            doc: a(document),
            element: a("#user_info"),
            open: function() {
                if (!h.element.hasClass("active")) {
                    h.element.addClass("active");
                    h.doc.one("click", h.close);
                    return false
                }
            },
            close: function() {
                h.element.removeClass("active")
            }
        };
        h.element.click(h.open);
        a("tbody").children().children(".check-column").find(":checkbox").click(function(j) {
            if ("undefined" == j.shiftKey) {
                return true
            }
            if (j.shiftKey) {
                if (!i) {
                    return true
                }
                b = a(i).closest("form").find(":checkbox");
                f = b.index(i);
                e = b.index(this);
                d = a(this).prop("checked");
                if (0 < f && 0 < e && f != e) {
                    b.slice(f, e).prop("checked",
                    function() {
                        if (a(this).closest("tr").is(":visible")) {
                            return d
                        }
                        return false
                    })
                }
            }
            i = this;
            return true
        });
        a("thead, tfoot").find(".check-column :checkbox").click(function(l) {
            var m = a(this).prop("checked"),
            k = "undefined" == typeof toggleWithKeyboard ? false: toggleWithKeyboard,
            j = l.shiftKey || k;
            a(this).closest("table").children("tbody").filter(":visible").children().children(".check-column").find(":checkbox").prop("checked",
            function() {
                if (a(this).closest("tr").is(":hidden")) {
                    return false
                }
                if (j) {
                    return a(this).prop("checked")
                } else {
                    if (m) {
                        return true
                    }
                }
                return false
            });
            a(this).closest("table").children("thead,  tfoot").filter(":visible").children().children(".check-column").find(":checkbox").prop("checked",
            function() {
                if (j) {
                    return false
                } else {
                    if (m) {
                        return true
                    }
                }
                return false
            })
        });
        a("#default-password-nag-no").click(function() {
            setUserSetting("default_password_nag", "hide");
            a("div.default-password-nag").hide();
            return false
        });
        a("#newcontent").bind("keydown.wpevent_InsertTab",
        function(o) {
            if (o.keyCode != 9) {
                return true
            }
            var l = o.target,
            q = l.selectionStart,
            k = l.selectionEnd,
            p = l.value,
            j,
            n;
            try {
                this.lastKey = 9
            } catch(m) {}
            if (document.selection) {
                l.focus();
                n = document.selection.createRange();
                n.text = "\t"
            } else {
                if (q >= 0) {
                    j = this.scrollTop;
                    l.value = p.substring(0, q).concat("\t", p.substring(k));
                    l.selectionStart = l.selectionEnd = q + 1;
                    this.scrollTop = j
                }
            }
            if (o.stopPropagation) {
                o.stopPropagation()
            }
            if (o.preventDefault) {
                o.preventDefault()
            }
        });
        a("#newcontent").bind("blur.wpevent_InsertTab",
        function(j) {
            if (this.lastKey && 9 == this.lastKey) {
                this.focus()
            }
        });
        if (g.length) {
            c = g.val();
            g.closest("form").submit(function() {
                if (g.val() == c) {
                    g.val("1")
                }
            })
        }
    });
    a(document).bind("wp_CloseOnEscape",
    function(c, b) {
        if (typeof(b.cb) != "function") {
            return
        }
        if (typeof(b.condition) != "function" || b.condition()) {
            b.cb()
        }
        return true
    })
})(jQuery);
 (function(d) {
    d.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "color", "outlineColor"],
    function(f, e) {
        d.fx.step[e] = function(g) {
            if (g.state == 0) {
                g.start = c(g.elem, e);
                g.end = b(g.end)
            }
            g.elem.style[e] = "rgb(" + [Math.max(Math.min(parseInt((g.pos * (g.end[0] - g.start[0])) + g.start[0]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[1] - g.start[1])) + g.start[1]), 255), 0), Math.max(Math.min(parseInt((g.pos * (g.end[2] - g.start[2])) + g.start[2]), 255), 0)].join(",") + ")"
        }
    });
    function b(f) {
        var e;
        if (f && f.constructor == Array && f.length == 3) {
            return f
        }
        if (e = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)) {
            return [parseInt(e[1]), parseInt(e[2]), parseInt(e[3])]
        }
        if (e = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)) {
            return [parseFloat(e[1]) * 2.55, parseFloat(e[2]) * 2.55, parseFloat(e[3]) * 2.55]
        }
        if (e = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)) {
            return [parseInt(e[1], 16), parseInt(e[2], 16), parseInt(e[3], 16)]
        }
        if (e = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)) {
            return [parseInt(e[1] + e[1], 16), parseInt(e[2] + e[2], 16), parseInt(e[3] + e[3], 16)]
        }
        if (e = /rgba\(0, 0, 0, 0\)/.exec(f)) {
            return a.transparent
        }
        return a[d.trim(f).toLowerCase()]
    }
    function c(g, e) {
        var f;
        do {
            f = d.curCSS(g, e);
            if (f != "" && f != "transparent" || d.nodeName(g, "body")) {
                break
            }
            e = "backgroundColor"
        }
        while (g = g.parentNode);
        return b(f)
    }
    var a = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: [255, 255, 255]
    }
})(jQuery);
var wpAjax = jQuery.extend({
    unserialize: function(c) {
        var d = {},
        e,
        a,
        b,
        f;
        if (!c) {
            return d
        }
        e = c.split("?");
        if (e[1]) {
            c = e[1]
        }
        a = c.split("&");
        for (b in a) {
            if (jQuery.isFunction(a.hasOwnProperty) && !a.hasOwnProperty(b)) {
                continue
            }
            f = a[b].split("=");
            d[f[0]] = f[1]
        }
        return d
    },
    parseAjaxResponse: function(a, f, g) {
        var b = {},
        c = jQuery("#" + f).html(""),
        d = "";
        if (a && typeof a == "object" && a.getElementsByTagName("wp_ajax")) {
            b.responses = [];
            b.errors = false;
            jQuery("response", a).each(function() {
                var h = jQuery(this),
                i = jQuery(this.firstChild),
                e;
                e = {
                    action: h.attr("action"),
                    what: i.get(0).nodeName,
                    id: i.attr("id"),
                    oldId: i.attr("old_id"),
                    position: i.attr("position")
                };
                e.data = jQuery("response_data", i).text();
                e.supplemental = {};
                if (!jQuery("supplemental", i).children().each(function() {
                    e.supplemental[this.nodeName] = jQuery(this).text()
                }).size()) {
                    e.supplemental = false
                }
                e.errors = [];
                if (!jQuery("wp_error", i).each(function() {
                    var j = jQuery(this).attr("code"),
                    m,
                    l,
                    k;
                    m = {
                        code: j,
                        message: this.firstChild.nodeValue,
                        data: false
                    };
                    l = jQuery('wp_error_data[code="' + j + '"]', a);
                    if (l) {
                        m.data = l.get()
                    }
                    k = jQuery("form-field", l).text();
                    if (k) {
                        j = k
                    }
                    if (g) {
                        wpAjax.invalidateForm(jQuery("#" + g + ' :input[name="' + j + '"]').parents(".form-field:first"))
                    }
                    d += "<p>" + m.message + "</p>";
                    e.errors.push(m);
                    b.errors = true
                }).size()) {
                    e.errors = false
                }
                b.responses.push(e)
            });
            if (d.length) {
                c.html('<div class="error">' + d + "</div>")
            }
            return b
        }
        if (isNaN(a)) {
            return ! c.html('<div class="error"><p>' + a + "</p></div>")
        }
        a = parseInt(a, 10);
        if ( - 1 == a) {
            return ! c.html('<div class="error"><p>' + wpAjax.noPerm + "</p></div>")
        } else {
            if (0 === a) {
                return ! c.html('<div class="error"><p>' + wpAjax.broken + "</p></div>")
            }
        }
        return true
    },
    invalidateForm: function(a) {
        return jQuery(a).addClass("form-invalid").find("input:visible").change(function() {
            jQuery(this).closest(".form-invalid").removeClass("form-invalid")
        })
    },
    validateForm: function(a) {
        a = jQuery(a);
        return ! wpAjax.invalidateForm(a.find(".form-required").filter(function() {
            return jQuery("input:visible", this).val() == ""
        })).size()
    }
},
wpAjax || {
    noPerm: "You do not have permission to do that.",
    broken: "An unidentified error has occurred."
});
jQuery(document).ready(function(a) {
    a("form.validate").submit(function() {
        return wpAjax.validateForm(a(this))
    })
});
 (function(b) {
    var a = {
        add: "ajaxAdd",
        del: "ajaxDel",
        dim: "ajaxDim",
        process: "process",
        recolor: "recolor"
    },
    c;
    c = {
        settings: {
            url: ajaxurl,
            type: "POST",
            response: "ajax-response",
            what: "",
            alt: "alternate",
            altOffset: 0,
            addColor: null,
            delColor: null,
            dimAddColor: null,
            dimDelColor: null,
            confirm: null,
            addBefore: null,
            addAfter: null,
            delBefore: null,
            delAfter: null,
            dimBefore: null,
            dimAfter: null
        },
        nonce: function(g, f) {
            var d = wpAjax.unserialize(g.attr("href"));
            return f.nonce || d._ajax_nonce || b("#" + f.element + ' input[name="_ajax_nonce"]').val() || d._wpnonce || b("#" + f.element + ' input[name="_wpnonce"]').val() || 0
        },
        parseClass: function(h, f) {
            var i = [],
            d;
            try {
                d = b(h).attr("class") || "";
                d = d.match(new RegExp(f + ":[\\S]+"));
                if (d) {
                    i = d[0].split(":")
                }
            } catch(g) {}
            return i
        },
        pre: function(i, g, d) {
            var f,
            h;
            g = b.extend({},
            this.wpList.settings, {
                element: null,
                nonce: 0,
                target: i.get(0)
            },
            g || {});
            if (b.isFunction(g.confirm)) {
                if ("add" != d) {
                    f = b("#" + g.element).css("backgroundColor");
                    b("#" + g.element).css("backgroundColor", "#FF9966")
                }
                h = g.confirm.call(this, i, g, d, f);
                if ("add" != d) {
                    b("#" + g.element).css("backgroundColor", f)
                }
                if (!h) {
                    return false
                }
            }
            return g
        },
        ajaxAdd: function(g, m) {
            g = b(g);
            m = m || {};
            var h = this,
            l = c.parseClass(g, "add"),
            j,
            d,
            f,
            i,
            k;
            m = c.pre.call(h, g, m, "add");
            m.element = l[2] || g.attr("id") || m.element || null;
            if (l[3]) {
                m.addColor = "#" + l[3]
            } else {
                m.addColor = m.addColor || "#FFFF33"
            }
            if (!m) {
                return false
            }
            if (!g.is('[class^="add:' + h.id + ':"]')) {
                return ! c.add.call(h, g, m)
            }
            if (!m.element) {
                return true
            }
            m.action = "add-" + m.what;
            m.nonce = c.nonce(g, m);
            j = b("#" + m.element + " :input").not('[name="_ajax_nonce"], [name="_wpnonce"], [name="action"]');
            d = wpAjax.validateForm("#" + m.element);
            if (!d) {
                return false
            }
            m.data = b.param(b.extend({
                _ajax_nonce: m.nonce,
                action: m.action
            },
            wpAjax.unserialize(l[4] || "")));
            f = b.isFunction(j.fieldSerialize) ? j.fieldSerialize() : j.serialize();
            if (f) {
                m.data += "&" + f
            }
            if (b.isFunction(m.addBefore)) {
                m = m.addBefore(m);
                if (!m) {
                    return true
                }
            }
            if (!m.data.match(/_ajax_nonce=[a-f0-9]+/)) {
                return true
            }
            m.success = function(e) {
                i = wpAjax.parseAjaxResponse(e, m.response, m.element);
                k = e;
                if (!i || i.errors) {
                    return false
                }
                if (true === i) {
                    return true
                }
                jQuery.each(i.responses,
                function() {
                    c.add.call(h, this.data, b.extend({},
                    m, {
                        pos: this.position || 0,
                        id: this.id || 0,
                        oldId: this.oldId || null
                    }))
                });
                h.wpList.recolor();
                b(h).trigger("wpListAddEnd", [m, h.wpList]);
                c.clear.call(h, "#" + m.element)
            };
            m.complete = function(e, n) {
                if (b.isFunction(m.addAfter)) {
                    var o = b.extend({
                        xml: e,
                        status: n,
                        parsed: i
                    },
                    m);
                    m.addAfter(k, o)
                }
            };
            b.ajax(m);
            return false
        },
        ajaxDel: function(k, i) {
            k = b(k);
            i = i || {};
            var j = this,
            d = c.parseClass(k, "delete"),
            h,
            g,
            f;
            i = c.pre.call(j, k, i, "delete");
            i.element = d[2] || i.element || null;
            if (d[3]) {
                i.delColor = "#" + d[3]
            } else {
                i.delColor = i.delColor || "#faa"
            }
            if (!i || !i.element) {
                return false
            }
            i.action = "delete-" + i.what;
            i.nonce = c.nonce(k, i);
            i.data = b.extend({
                action: i.action,
                id: i.element.split("-").pop(),
                _ajax_nonce: i.nonce
            },
            wpAjax.unserialize(d[4] || ""));
            if (b.isFunction(i.delBefore)) {
                i = i.delBefore(i, j);
                if (!i) {
                    return true
                }
            }
            if (!i.data._ajax_nonce) {
                return true
            }
            h = b("#" + i.element);
            if ("none" != i.delColor) {
                h.css("backgroundColor", i.delColor).fadeOut(350,
                function() {
                    j.wpList.recolor();
                    b(j).trigger("wpListDelEnd", [i, j.wpList])
                })
            } else {
                j.wpList.recolor();
                b(j).trigger("wpListDelEnd", [i, j.wpList])
            }
            i.success = function(e) {
                g = wpAjax.parseAjaxResponse(e, i.response, i.element);
                f = e;
                if (!g || g.errors) {
                    h.stop().stop().css("backgroundColor", "#faa").show().queue(function() {
                        j.wpList.recolor();
                        b(this).dequeue()
                    });
                    return false
                }
            };
            i.complete = function(e, l) {
                if (b.isFunction(i.delAfter)) {
                    h.queue(function() {
                        var m = b.extend({
                            xml: e,
                            status: l,
                            parsed: g
                        },
                        i);
                        i.delAfter(f, m)
                    }).dequeue()
                }
            };
            b.ajax(i);
            return false
        },
        ajaxDim: function(h, n) {
            if (b(h).parent().css("display") == "none") {
                return false
            }
            h = b(h);
            n = n || {};
            var i = this,
            m = c.parseClass(h, "dim"),
            g,
            d,
            f,
            k,
            j,
            l;
            n = c.pre.call(i, h, n, "dim");
            n.element = m[2] || n.element || null;
            n.dimClass = m[3] || n.dimClass || null;
            if (m[4]) {
                n.dimAddColor = "#" + m[4]
            } else {
                n.dimAddColor = n.dimAddColor || "#FFFF33"
            }
            if (m[5]) {
                n.dimDelColor = "#" + m[5]
            } else {
                n.dimDelColor = n.dimDelColor || "#FF3333"
            }
            if (!n || !n.element || !n.dimClass) {
                return true
            }
            n.action = "dim-" + n.what;
            n.nonce = c.nonce(h, n);
            n.data = b.extend({
                action: n.action,
                id: n.element.split("-").pop(),
                dimClass: n.dimClass,
                _ajax_nonce: n.nonce
            },
            wpAjax.unserialize(m[6] || ""));
            if (b.isFunction(n.dimBefore)) {
                n = n.dimBefore(n);
                if (!n) {
                    return true
                }
            }
            g = b("#" + n.element);
            d = g.toggleClass(n.dimClass).is("." + n.dimClass);
            f = c.getColor(g);
            g.toggleClass(n.dimClass);
            k = d ? n.dimAddColor: n.dimDelColor;
            if ("none" != k) {
                g.animate({
                    backgroundColor: k
                },
                "fast").queue(function() {
                    g.toggleClass(n.dimClass);
                    b(this).dequeue()
                }).animate({
                    backgroundColor: f
                },
                {
                    complete: function() {
                        b(this).css("backgroundColor", "");
                        b(i).trigger("wpListDimEnd", [n, i.wpList])
                    }
                })
            } else {
                b(i).trigger("wpListDimEnd", [n, i.wpList])
            }
            if (!n.data._ajax_nonce) {
                return true
            }
            n.success = function(e) {
                j = wpAjax.parseAjaxResponse(e, n.response, n.element);
                l = e;
                if (!j || j.errors) {
                    g.stop().stop().css("backgroundColor", "#FF3333")[d ? "removeClass": "addClass"](n.dimClass).show().queue(function() {
                        i.wpList.recolor();
                        b(this).dequeue()
                    });
                    return false
                }
            };
            n.complete = function(e, o) {
                if (b.isFunction(n.dimAfter)) {
                    g.queue(function() {
                        var p = b.extend({
                            xml: e,
                            status: o,
                            parsed: j
                        },
                        n);
                        n.dimAfter(l, p)
                    }).dequeue()
                }
            };
            b.ajax(n);
            return false
        },
        getColor: function(e) {
            var d = jQuery(e).css("backgroundColor");
            return d || "#ffffff"
        },
        add: function(k, g) {
            k = b(k);
            var i = b(this),
            d = false,
            j = {
                pos: 0,
                id: 0,
                oldId: null
            },
            l,
            h,
            f;
            if ("string" == typeof g) {
                g = {
                    what: g
                }
            }
            g = b.extend(j, this.wpList.settings, g);
            if (!k.size() || !g.what) {
                return false
            }
            if (g.oldId) {
                d = b("#" + g.what + "-" + g.oldId)
            }
            if (g.id && (g.id != g.oldId || !d || !d.size())) {
                b("#" + g.what + "-" + g.id).remove()
            }
            if (d && d.size()) {
                d.before(k);
                d.remove()
            } else {
                if (isNaN(g.pos)) {
                    l = "after";
                    if ("-" == g.pos.substr(0, 1)) {
                        g.pos = g.pos.substr(1);
                        l = "before"
                    }
                    h = i.find("#" + g.pos);
                    if (1 === h.size()) {
                        h[l](k)
                    } else {
                        i.append(k)
                    }
                } else {
                    if ("comment" != g.what || 0 === b("#" + g.element).length) {
                        if (g.pos < 0) {
                            i.prepend(k)
                        } else {
                            i.append(k)
                        }
                    }
                }
            }
            if (g.alt) {
                if ((i.children(":visible").index(k[0]) + g.altOffset) % 2) {
                    k.removeClass(g.alt)
                } else {
                    k.addClass(g.alt)
                }
            }
            if ("none" != g.addColor) {
                f = c.getColor(k);
                k.css("backgroundColor", g.addColor).animate({
                    backgroundColor: f
                },
                {
                    complete: function() {
                        b(this).css("backgroundColor", "")
                    }
                })
            }
            i.each(function() {
                this.wpList.process(k)
            });
            return k
        },
        clear: function(h) {
            var g = this,
            f,
            d;
            h = b(h);
            if (g.wpList && h.parents("#" + g.id).size()) {
                return
            }
            h.find(":input").each(function() {
                if (b(this).parents(".form-no-clear").size()) {
                    return
                }
                f = this.type.toLowerCase();
                d = this.tagName.toLowerCase();
                if ("text" == f || "password" == f || "textarea" == d) {
                    this.value = ""
                } else {
                    if ("checkbox" == f || "radio" == f) {
                        this.checked = false
                    } else {
                        if ("select" == d) {
                            this.selectedIndex = null
                        }
                    }
                }
            })
        },
        process: function(e) {
            var f = this,
            d = b(e || document);
            d.delegate('form[class^="add:' + f.id + ':"]', "submit",
            function() {
                return f.wpList.add(this)
            });
            d.delegate('[class^="add:' + f.id + ':"]:not(form)', "click",
            function() {
                return f.wpList.add(this)
            });
            d.delegate('[class^="delete:' + f.id + ':"]', "click",
            function() {
                return f.wpList.del(this)
            });
            d.delegate('[class^="dim:' + f.id + ':"]', "click",
            function() {
                return f.wpList.dim(this)
            })
        },
        recolor: function() {
            var f = this,
            e,
            d;
            if (!f.wpList.settings.alt) {
                return
            }
            e = b(".list-item:visible", f);
            if (!e.size()) {
                e = b(f).children(":visible")
            }
            d = [":even", ":odd"];
            if (f.wpList.settings.altOffset % 2) {
                d.reverse()
            }
            e.filter(d[0]).addClass(f.wpList.settings.alt).end().filter(d[1]).removeClass(f.wpList.settings.alt)
        },
        init: function() {
            var d = this;
            d.wpList.process = function(e) {
                d.each(function() {
                    this.wpList.process(e)
                })
            };
            d.wpList.recolor = function() {
                d.each(function() {
                    this.wpList.recolor()
                })
            }
        }
    };
    b.fn.wpList = function(d) {
        this.each(function() {
            var e = this;
            this.wpList = {
                settings: b.extend({},
                c.settings, {
                    what: c.parseClass(this, "list")[1] || ""
                },
                d)
            };
            b.each(a,
            function(g, h) {
                e.wpList[g] = function(i, f) {
                    return c[h].call(e, i, f)
                }
            })
        });
        c.init.call(this);
        this.wpList.process();
        return this
    }
})(jQuery);