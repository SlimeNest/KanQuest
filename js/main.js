$(function () {
  var require = new Object(),
          questList = $('#questList'),
          requiredShips = $('#requiredShips'),
          questDoneStr = getCookie('KanQuest_done'),
          questDone = questDoneStr.length ? questDoneStr.split(',') : [];

  require = {
    list: {},
    addShip: function (ship) {
      if ( typeof (require.list[ship]) != 'number' ) {
        require.list[ship] = 1;
      } else {
        require.list[ship]++;
      }
    },
    delShip: function (ship) {
      if ( typeof (require.list[ship]) != 'number' ) {
        return;
      } else if ( require.list[ship] > 0 ) {
        require.list[ship]--;
      } else {
        require.list[ship] = 0;
      }
    }
  };

  var toggleAccomplish = function (e) {
    var switchBtn = $(e.target),
            switchBtnId = switchBtn.attr('id');
    if ( !switchBtnId.indexOf('accomplishBtn_') ) {
      var questId = switchBtnId.substring(14);
      //console.log(questId);
      switchBtn.toggleClass('active');

      if ( switchBtn.hasClass('active') ) {
        $('#accomplishVal_' + questId).val('1');
        questDone.push(questId);
        
        $.each(quests[questId], function(i, ship){
          require.delShip(ship);
        });
      } else {
        $('#accomplishVal_' + questId).val('0');
        questDone = deleteArray(questDone, questId);
        
        $.each(quests[questId], function(i, ship){
          require.addShip(ship);
        });
      }

      listRequire();
      setCookie('KanQuest_done', questDone.join(','), 30 * 24 * 3600);
    } else {
      return false;
    }
  };

  questList.html('');

  countRequire();

  function countRequire() {
    $.each(quests, function (questNo, requireShips) {
      var questTr = $('<tr>').attr('id', 'quest_' + questNo),
              questTdNo = $('<td>').html(questNo).appendTo(questTr),
              questTdNeed = $('<td>').html(requireShips.join(',')).appendTo(questTr),
              accomplishBtn = $('<span>').addClass('switch').attr('id', 'accomplishBtn_' + questNo),
              accomplishVal = $('<input>').attr({'type': 'hidden', 'id': 'accomplishVal_' + questNo}),
              questTdDone = $('<td>').append(accomplishVal, accomplishBtn).appendTo(questTr);

      accomplishBtn.on('click', toggleAccomplish);
      questList.append(questTr);

      if ( $.inArray(questNo, questDone) >= 0 ) {
        $('#accomplishVal_' + questNo).val('1');
        $('#accomplishBtn_' + questNo).addClass('active');
      } else {
        $.each(requireShips, function (i, ship) {
          require.addShip(ship);
        });
      }
    });

    listRequire();
  }

  function listRequire() {
    requiredShips.html('');
    $.each(require.list, function (ship, num) {
      var l = $('<span>')
              .addClass('label label-primary')
              .html(ship + ' <span class="badge">' + num + '</span>');
      num && requiredShips.append(l);
    });
  }

//cookie
  function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + '=' + escape(value) +
            ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
  }
  function getCookie(c_name) {
    var c_start, c_end;
    if ( document.cookie.length > 0 ) {
      c_start = document.cookie.indexOf(c_name + '=');
      if ( c_start != -1 ) {
        c_start = c_start + c_name.length + 1;
        c_end = document.cookie.indexOf(';', c_start);
        if ( c_end == -1 ) {
          c_end = document.cookie.length;
        }
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return '';
  }

  function deleteArray(array, child) {
    for ( var i in array ) {
      if ( array[i] + '' == child + '' ) {
        array.splice(i, 1);
        break;
      }
    }
    return array;
  }
});
