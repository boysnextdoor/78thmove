;(function ($) {
  $(document).ready(function () {
    var definitelyNotADate = 'Definitely Not a Date'
    var input = document.createElement('input')
    input.setAttribute('type', 'date')
    input.setAttribute('value', definitelyNotADate)
    var browserDoesntSupportDateTypeInputTags = input.value === definitelyNotADate

    if (browserDoesntSupportDateTypeInputTags) {
      $('.datepicker').datepicker({
        language: 'ko-KR',
        format: 'yyyy-mm-dd'
      })
    }

    function twoDigit (n) {
      return parseInt(n) < 10 ? '0' + n : n.toString()
    }

    var d = new Date()
    var yyyy = d.getFullYear()
    var mm = twoDigit(d.getMonth() + 1)
    var dd = twoDigit(d.getDate())
    var val = yyyy + '-' + mm + '-' + dd

    $('input[name=expectedStartDate]').val(val)
    $('input[name=expectedEndDate]').val(val)

    var selector = 'input.etc[type=checkbox], .dropdown > input[type=hidden]:first'
    $(selector).change(function (e) {
      var $target = $(e.target)
      var type = $target.attr('type')
      var etc = (type === 'checkbox' && $target.prop('checked')) ||
        (type === 'hidden' && $target.val() === 'etc')
      var field = $target.attr('data-field')
      $('input[type=text][data-field=' + field + ']')
        .css('visibility', etc ? 'visible' : 'hidden')
        .css('position', etc ? 'static' : 'absolute')
    })

    $('button[type=submit]').click(function (e) {
      var requiredFields = Array.prototype.reverse.call($('.required.field'))

      var ok = true
      requiredFields.each((_, elem) => {
        var $elem = $(elem)

        if ($elem.find('input, textarea').val()) return true
        else ok = false

        $elem.addClass('error')
        elem.scrollIntoView({
          behavior: 'smooth'
        })
        return true
      })

      if (!ok) return false

      var serialized = {}
      var arr = $('form').serializeArray()
      for (var i = 0; i < arr.length; ++i) {
        var pair = arr[i]
        var key = pair.name
        var value = pair.value
        if (value === 'etc') continue
        var existing = serialized[key]
        serialized[key] = existing !== undefined && value ? [value].concat(existing) : value
      }

      saveData(serialized, function () {
        location.href = 'success.html'
      })

      return false
    })
  })

  function saveData (data, callback) {
    var key = firebase.database().ref().child('requests').push().key
    firebase.database().ref('/requests/' + key).set(data).then(callback)
  }
})(jQuery);