;(function ($) {
  $(document).ready(function () {
    var ref = firebase.database()
      .ref('/requests/')
      .limitToLast(20)
    
    ref.on('value', function (snapshot) {
      $('.dimmer').addClass('active')

      var index = 0
      snapshot.forEach(function (child) {
        render(index++, child.val())
      })
      
      $('.dimmer').removeClass('active')
    })
  })

  function render (index, item) {
    if (item._taken) return

    var title = item['title'] || item['프로젝트 명']
    var $list = $('#list')
    var itemCount = $list.find('table').length
    var $table = $('div#' + index + ' table')

    if (index >= itemCount) {
      var header = '<h3 class="ui header">' + title + '</h3>'
      var link = '<a class="disabled" href="">파일 보기</a>'
      var table = '<table class="ui definition table"></table>'
      var $div = $('<div id="' + index + '" class="eight wide column item">' + header + link + table + '</div>')
      $list.prepend($div)
      $table = $div.find('table')
    }

    var rowCount = $table.find('tr').length
    var i = 0
    for (var key in item) {
      if (key[0] === '_') continue
      if (key === '연락처') continue
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
