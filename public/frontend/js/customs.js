var showBlock = function(block) {
    if (block == 'driver-content') {
        if ($('.check-box-order:checked').length == 0) {
            return false;
        }
    }
    if (block != undefined) {
        $('.block-content').removeClass('active');
        $('#' + block).addClass('active');
    }
}

var  _getRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
Date.prototype.customFormat = function(formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    YY = ((YYYY = this.getFullYear()) + "").slice(-2);
    MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
    h = (hhh = this.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    hhhh = h < 10 ? ('0' + hhh) : hhh;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};
$(function() {

    $(".search-input").keyup(function() {
        $('.hidden-tr').removeClass('active');
        $('.extend-btn span.glyphicon-chevron-down').show();
        $('.extend-btn span.glyphicon-chevron-up').hide();
        var searchTerm = $(this).val();
        var taget = $(this).data('taget');
        var listItem = $(taget + ' tbody').children(' > tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('")
        $.extend($.expr[':'], {
            'containsi': function(elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });
        $(taget + " > tbody > tr:not(.hidden-tr)").not(":containsi('" + searchSplit + "')").each(function(e) {
            $(this).attr('visible', 'false');
        });
        $(taget + " > tbody > tr:not(.hidden-tr):containsi('" + searchSplit + "')").each(function(e) {
            $(this).attr('visible', 'true');
        });
        var jobCount = $(taget + '> tbody > tr[visible="true"]:not(.hidden-tr)').length;
        $('.counter').text(jobCount + ' item');
        if (jobCount == '0') { $('.no-result').show(); } else { $('.no-result').hide(); }
    });
    $(document).on('click', '.extend-btn', function(argument) {
        $(this).find('span').toggle();
        $(this).parents('tr').next().toggleClass('active');
    });
    $(document).on('click', '.show-block', function(argument) {
        $('#main-menu li a.show-block').removeClass('active');
        $(this).addClass('active');
        var block = $(this).data('block');
        showBlock(block);
        return false;
    });
    $(document).on('click', '.add-new-product', function(argument) {
        var i = $('.new-p').length + 1;
        $(this).parents('.products-area').append('<div class="new-p parent-product">' + $('.main-products-area').html().replace(/\[0\]/g, "[" + i + "]") + '</div>');
        $('.product-qty').mask('PPPPPPPPPPPPPPPPPPPPP', {
            'translation': {
                P: {
                    pattern: /[0-9]/
                }
            }
        });
        return false;
    });
    $(document).on('click', '.remove-new-product', function(argument) {
        $(this).parents('.new-p').remove();
        return false;
    });
    $(document).on('click', '.show-content-block', function(argument) {

        $(this).find('.glyphicon').toggle();
        var block = $('.show-block.active').data('block');

        if (block == 'driver-content') {
            if ($('.check-box-order:checked').length == 0) {
                return false;
            }
        }
        if (block != undefined) {
            $('#' + block).toggleClass('active');
        }
        return false;
    });
    //$('.show-content-block').click();
    if ($('input.datepicker-input').length > 0) {
        var date = new Date();
        $('input.datepicker-input').val((date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear()).datepicker({
            startDate: "-",
            startView: 2,
            maxViewMode: 0,
            clearBtn: true,
            multidateSeparator: "d",
            autoclose: true
        });
    }
    if ($('.datepair-container .time').length > 0) {
        $('.datepair-container .time').timepicker({
            'minTime': new Date(),
            'timeFormat': 'H:i',
            'showDuration': true,
        });
        $('.datepair-container').datepair();
    }
    nMap.int(function(status) {
        if (status) {
            $('#loading').hide()
        };
    });

    var now = new Date().getHours();
    var h = 1;
    var m = "00";
    var _class = "";
    for (var i = 36; i < 144; i++) {
        var _h = parseInt(i / 6);
        m = i % 6;
        if (now == (h - 1)) {
            _class = "current-time";
        }
        $('#time-line').append('<span class="time-point ' + _class + '">' + _h + ':' + m + '0</span>')

    }
})
