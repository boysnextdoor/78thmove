;(function ($) {
  $(document).ready(function () {
    $('.dimmer').addClass('active')
    renderAll()
    setInterval(renderAll, 30 * 1000)
  })

  function renderAll () {
    $.ajax('https://us-central1-thmove-2f518.cloudfunctions.net/get').then(function (list) {
      for (var i = 0; i < list.length; ++i) {
        var child = list[i]
        render(i, child)
      }
      $('.dimmer').removeClass('active')
    }).catch(function (error) {
      $('.dimmer').removeClass('active')
    })
  }

  function render (index, item) {
    var title = item['title'] || item['프로젝트 명']
    var $list = $('#list')
    var itemCount = $list.find('table').length
    var $table = $('div#' + index + ' table')

    if (index >= itemCount) {
      var header = '<h3 class="ui header">' + title + '</h3>'
      var link = '<a class="disabled" href="">파일 보기</a>'
      var table = '<table class="ui definition table"></table>'
      var $div = $('<div id="' + index + '" class="eight wide column item">' + header + link + table + '</div>')
      $list.append($div)
      $table = $div.find('table')
    }

    var rowCount = $table.find('tr').length
    var i = 0
    for (var key in item) {
      if (key[0] === '_') continue
      var $row = $('row#' + i++)
      if (i >= rowCount) {
        $row = $('<tr><td class="key"></td><td class="val"></td></tr>')
        $table.append($row)
      }
      $row.find('td.key').text(key)
      $row.find('td.val').text(item[key])
    }

    var file = item._file
    if (!file) return
    var fileRef = firebase.storage().ref().child(file)
    fileRef.getDownloadURL()
      .then(function (url) {
        $('div#' + index + ' > a').attr('href', url).toggleClass('disabled')
      })
      .catch(function (error) {
        console.log(error)
      })
  }
})(jQuery);