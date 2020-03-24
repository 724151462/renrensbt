$(function() {
	var $content = $('<div class="footer-pad" ></div>')
	$(".main-footer").eq(0).before($content)
	// console.log(document.body.clientHeight, $('.sb-container').get(0).clientHeight)
	if (document.body.clientWidth > 750) {
		let fun = function() {
			let timer;
			return function() {
				if (timer) {
					clearTimeout(timer)
				}
				timer = setTimeout(() => {
					var scrollTop = $(this).scrollTop();
					var scrollHeight = $(document).height();
					var windowHeight = $(this).height();
					console.log(scrollTop + windowHeight == scrollHeight)
					if (scrollTop + windowHeight == scrollHeight) {
						$('.main-footer').show()
					}else{
						$('.main-footer').hide()
					}
					timer = null
				}, 200);
			}
			
		}
		window.onscroll = fun()
	}
})
