//For table filters
(function(document) {
  'use strict';
  var TableFilter = (function(Arr) {
    var input;

    function onInputEvent(e) {
      input = e.target;
      var tables = document.getElementsByClassName(input.getAttribute('data-table'));
      Arr.forEach.call(tables, function(table) {
        Arr.forEach.call(table.tBodies, function(tbody) {
          Arr.forEach.call(tbody.rows, filterRow);
        });
      });
    }

    function filterRow(row) {
      var text = row.textContent.toLowerCase(), val = input.value.toLowerCase();
      row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    return {
      init: function() {
        var inputs = document.getElementsByClassName('tableFilter');
        Arr.forEach.call(inputs, function(input) {
          input.oninput = onInputEvent;
        });
      }
    };
  })(Array.prototype);

  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      TableFilter.init();
    }
  });

})(document);


//sort tables
var compare = {
  name: function(a, b) {
    a = a.replace(/^the /i, '');
    b = b.replace(/^the /i, '');
    if (a < b) {
      return -1;
    } else {
      return a > b ? 1 : 0;
    }
  },
  duration: function(a, b) {
    a = a.split(':');
    b = b.split(':');
    a = Number(a[0]) * 60 + Number(a[1]);
    b = Number(b[0]) * 60 + Number(b[1]);
    return a - b;
  },
  date: function(a, b) {
    a = new Date(a);
    b = new Date(b);
    return a - b;
  }
};

$('.sortable').each(function(){
  var $table = $(this);
  var $tbody = $table.find('tbody');
  var $controls = $table.find('th');
  var rows = $tbody.find('tr').toArray();

  $controls.on('click', function() {
    var $header = $(this);
    var order = $header.data('sort');
    var column;

    if ($header.is('.ascending') || $header.is('.descending')) {
      $header.toggleClass('ascending descending');
      $tbody.append(rows.reverse());
    } else {
      $header.addClass('ascending');
      $header.siblings().removeClass('ascending descending');
      if (compare.hasOwnProperty(order)) {
        column = $controls.index(this);
        rows.sort(function(a, b){
          a = $(a).find('td').eq(column).text();
          b = $(b).find('td').eq(column).text();
          return compare[order](a, b);
        });
        $tbody.append(rows);
      }
    }
  });
});