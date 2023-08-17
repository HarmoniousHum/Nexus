requirejs.config({
	config: {
		"moment": {
			noGlobal: true
		}
	},
	paths: {
		"jquery": "http://code.jquery.com/jquery-2.1.3.min",
		"moment": "http://momentjs.com/downloads/moment.min",
		"gms-ajax": "https://dl.dropboxusercontent.com/s/r4ph4vdfof1bkpf/gms-ajax",
		"gms-page": "https://dl.dropboxusercontent.com/s/d8wl74k6tgmp1cl/gms-page",
		"gms-user": "https://dl.dropboxusercontent.com/s/v1n6y1grc7879kp/gms-user",
		"gms-comment-form": "https://dl.dropboxusercontent.com/s/y5htsw2n7b3xxv7/gms-comment-form",
		"gms-storage": "https://dl.dropboxusercontent.com/s/5jowuu26nmm6elj/gms-storage",
		"gms-comments-loader": "https://dl.dropboxusercontent.com/s/empaxuwcqc0lj6l/gms-comments-loader",
		"gms-spoilers": "https://dl.dropboxusercontent.com/s/fzwsql6n3r50dg9/gms-spoilers",
		"gms-pictogram-loader": "https://dl.dropboxusercontent.com/s/cn3qosa0uml11yp/gms-pictogram-loader",
		"gms-box": "https://dl.dropboxusercontent.com/s/lpw8y9vtpmdvgst/gms-box",
		"gms-previewer": "https://dl.dropboxusercontent.com/s/s1w0n59ea7ex1kv/gms-previewer",
		"gms-validator": "https://dl.dropboxusercontent.com/s/5fmz9n34i491gpg/gms-validator",
		"gms-progress-meter": "https://dl.dropboxusercontent.com/s/4hw65x5okol446b/gms-progress-meter",
		"gms-utility": "https://dl.dropboxusercontent.com/s/65rgb6f25nqp3lt/gms-utility",
		"xbbcode": "https://dl.dropboxusercontent.com/s/yo7npv3q9hak4o8/xbbcode",
		"gms-miscellaneous": "https://dl.dropboxusercontent.com/s/38rpei6gqdfpfg9/gms-miscellaneous",
		"gms-time": "https://dl.dropboxusercontent.com/s/6hyocs6aibiei1w/gms-time",
		"gms-last-modified": "https://dl.dropboxusercontent.com/s/8zd1zd3uvfalv0h/gms-last-modified",
		"gms-slider": "https://dl.dropboxusercontent.com/s/w22wqv3vvn8xtud/gms-slider",
		"gms-unclumper": "https://www.dropbox.com/s/2vrmzem9k44zw9x/gms-unclumper"
	}
});

requirejs(["jquery"], function($) {
	var $win = $(window);
	var $doc = $(document);
	
	requirejs(["gms-storage"], function(storage) {
		var popUpCookie = storage.getStorageItem({
			name: "clickwrap",
			type: "node",
			persistence: "local"
		});
		
		$doc.ready(function() {
			var $container = $("#clickwrap-container");
			if (!popUpCookie.isSet) {
				$container.show();
			}
			$("#clickwrap-agree").on("click", function() {
				$container.hide();
				popUpCookie.set(null); // Actual value does not matter.
			});
			$("#clickwrap-disagree").on("click", function() {
				window.location.assign("/community/frontpage");
			});
		});
	});
	
	requirejs(["gms-utility"], function(util) {
		$doc.ready(function() {
			util.repliesToAdds();
		});
	});

	require(["gms-comments-loader", "gms-utility", "gms-spoilers", "gms-time", "gms-progress-meter"], function(commentsLoader, util, spoilers, time, ProgressMeter) {
		//ProgressMeter.settings.imgSrc =
		//	"https://dl.dropboxusercontent.com/u/255455312/falling-stones.gif";
		commentsLoader.settings.success = function() {
			util.repliesToAdds();
			spoilers.generate();
			time.replaceAllWithCorrect(true);
		};
		$doc.ready(function() {
			commentsLoader.init();
		});
	});
	
	requirejs(["gms-progress-meter"], function(ProgressMeter) {
		ProgressMeter.settings.imgSrc = "https://dl.dropboxusercontent.com/u/255455312/falling-stones.gif";
		requirejs(["gms-utility", "gms-comment-form", "gms-spoilers", "gms-previewer"],
		function(util, CommentForm, spoilers, Previewer) {
			CommentForm.settings.success = function() {
				util.repliesToAdds();
				spoilers.generate();
			};

			Previewer.settings.dateFormat = "dddd, MMMM D, YYYY - h:mma";
			//ProgressMeter.settings.imgSrc =
			//	"https://dl.dropboxusercontent.com/u/255455312/falling-stones.gif";

			$doc.ready(function() {
				CommentForm.changeRedirects();
				util.repliesToAdds();
				new CommentForm().summon();
			});
		});
	});
	
	$doc.ready(function() {
		var labels = document.getElementsByClassName("accordion-label");
		Array.prototype.forEach.call(labels, function(label, i, arr) {
			var checkbox = document.getElementById(label.htmlFor);
			var accordion = checkbox.nextElementSibling;
			var accordionContent = accordion.querySelector(".accordion-inner, .accordion-content"); // Remember to remove .accordion-inner

			label.addEventListener("click", function(e) {
				var height = window.getComputedStyle(accordionContent).height;
				accordion.style.maxHeight = checkbox.checked ? "0px" : height;
			}, false);
		}, this);
		
		var mainBlock = document.getElementById("main-block");
		var checkboxes = mainBlock.getElementsByClassName("accordion-checkbox");
		
		var condenseAllButton = document.createElement("button");
		condenseAllButton.textContent = "Condense All";
		
		condenseAllButton.addEventListener("click", function(e) {
			Array.prototype.forEach.call(checkboxes, function(checkbox, i, arr) {
				if (checkbox.checked) {
					checkbox.click();
					var accordion = checkbox.nextElementSibling;
					accordion.style.maxHeight = "0px";
				}
			}, this);
		}, false);
		
		mainBlock.appendChild(condenseAllButton);
	});
	
	requirejs(["gms-utility"], function(util) {
		util.load("https://dl.dropboxusercontent.com/s/8zd1zd3uvfalv0h/gms-last-modified.js");
		util.load("https://dl.dropboxusercontent.com/s/pnc5ssyzs7x4lwd/gms-pullout.js");
	});

	requirejs(["gms-spoilers"], function(spoilers) {
		$win.on("load", function() {
			spoilers.minWidth = spoilers.minHeight = 0;
			spoilers.generate();
		});
	});
	
	requirejs(["gms-ajax", "gms-page", "jquery"], function(ajax, page, $) {
		// This if-statement is here because another blog entry shares Nexus.js.
		if (page.nodeNum === "114750") { // For Nexus.
			ajax.get("https://dl.dropboxusercontent.com/s/2jmsechyo7yi3vr/Nexus-updates.html", {
				load: function(doc) {
					var updates = document.adoptNode(doc.getElementById("updates"));
					$("#disclaimer-container").after(updates);
				}
			});
		}
	});
	

	// var content = $('.accordion');
	// content.inner = $('.accordion > .inner');
	// var label = $(".accordion-label");
	//
	// /* Class names. */
	// var openClass = "accordion-open";
	// var closedClass = "accordion-closed";
	// var transitions = "accordion-transitions";
	//
	// function transitionCallback( jQueryElem ) {
	// 	if (jQueryElem.hasClass(openClass)) {
	// 		jQueryElem.css("max-height", 9999);
	// 	}
	// }
	//
	// function labelClickAction( jQueryElem ) {
	// 	jQueryElem.toggleClass(openClass + " " + closedClass);
	// 	jQueryElem.data("contentHeight", jQueryElem.outerHeight());
	//
	// 	var elemContentHeight = jQueryElem.data("contentHeight");
	//
	// 	if (jQueryElem.hasClass(closedClass)) {
	// 		jQueryElem.removeClass(transitions).css("max-height", elemContentHeight);
	// 		window.setTimeout(function(){
	// 			jQueryElem.addClass(transitions).css({
	// 				"max-height": 0
	// 			});
	// 		} , 10);
	// 	} else if (jQueryElem.hasClass(openClass)) {
	// 		jQueryElem.data("contentHeight", elemContentHeight + jQueryElem.find(".inner").outerHeight());
	// 		jQueryElem.css({
	// 			"max-height": jQueryElem.data("contentHeight")
	// 		});
	// 	}
	// }
	//
	// /* Initialize accordions */
	// for (var i = 0; i < content.length; ++i) {
	// 	content.eq(i).on("transitionEnd webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd", function() {
	// 		transitionCallback(content.eq(i));
	// 	});
	// 	label.eq(i).on("click", function() {
	// 		labelClickAction(content.eq(i));
	// 	});
	// }
	
	document.title = document.title.replace(" | The Endless Forest", "");

	document.body.addEventListener("touchstart", function(e) {
		if (e.target.classList.contains("tooltip-marker")) {
			$(e.target).find("+ .tooltip").toggle();
			if (e.target.tagName.toLowerCase() === "a") {
				e.preventDefault();
			}
		}
	}, false);

	$doc.ready(function() {
		$(".tooltip-marker").removeAttr("onclick");
	});

	var newDoctype = document.implementation.createDocumentType('html', '', '');
	document.doctype.parentNode.replaceChild(newDoctype, document.doctype);
});