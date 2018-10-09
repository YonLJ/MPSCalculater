window.onload = function () {
	var plan, batch, first, last, now, secure, loss, qua;
	$('#oneSubmit').click(function () {
		if ($('#plan').val() == "" ||
			$('#batch').val() == "" ||
			$('#first').val() == "" ||
			$('#last').val() == "" ||
			$('#secure').val() == "" ||
			$('#now').val() == "") {
			alert("请输必填字段!");
		} else {
			plan = +$('#plan').val();
			batch = +$('#batch').val();
			first = +$('#first').val();
			last = +$('#last').val();
			secure = +$('#secure').val();
			now = +$('#now').val();

			if ($('#qua').val() == "") {
				qua = 1;
			} else {
				qua = (+$('#qua').val()) / 100;
			}

			if ($('#loss').val() == "") {
				loss = 0;
			} else {
				loss = (+$('#loss').val()) / 100;
			}

			$(window).attr('location', '#pagetwo');
		}
	});
	var fore = [];
	var deal = [];
	$('#twoSubmit').click(function () {
		for (var i = 1; i <= 11; i++) {
			fore[i] = $('.ftr :nth-child(' + (i + 1) + ') input').val();
			deal[i] = $('.str :nth-child(' + (i + 1) + ') input').val();
		}
		Calculate();

	});

	function Calculate() {
		// 计划接收量
		if (plan > 0)
			$('#tr4 :nth-child(3)').text(plan);
		//预计可用库存
		if (now > 0)
			$('#tr5 :nth-child(2)').text(now);

		if (secure > 0)
			$('#only :nth-child(2)').text(secure);

		for (var i = 1; i <= 11; i++) {
			var j = i + 2;
			//填入预测量、合同量
			$('#tr1 :nth-child(' + j + ')').text(fore[i]);
			$('#tr2 :nth-child(' + j + ')').text(deal[i]);
			//计算毛需求
			var result;
			if (i <= first) {
				result = (+deal[i]) / (1 - loss);
				result = Math.ceil(result);
			} else if (i > first && i <= last) {
				result = Math.max(fore[i], deal[i]) / (1 - loss);
				result = Math.ceil(result);
			} else {
				result = (+fore[i]) / (1 - loss);
				result = Math.ceil(result);
			}
			if (result > 0)
				$('#tr3 :nth-child(' + j + ')').text(result);
		}

		for (var i = 1; i <= 11; i++) {
			var j = i + 2;
			Stock(j);
			Net(j);
			OutPut(j);
		}

		for (var i = 1; i <= 11; i++) {
			var j = i + 2;
			if (i != 11)
				InPut(j);
			Remain(j);
		}

	}

	function Stock(j) {
		var tr5 = +$('#tr5 :nth-child(' + (j - 1) + ')').text(),
			tr4 = +$('#tr4 :nth-child(' + j + ')').text(),
			tr3 = +$('#tr3 :nth-child(' + j + ')').text(),
			tr7 = +$('#tr7 :nth-child(' + j + ')').text(),
			result = tr5 + tr4 - tr3 + tr7;
		if (result > 0)
			$('#tr5 :nth-child(' + j + ')').text(result);
	}

	function Net(x) {
		var j = x + 1,
			tr5 = +$('#tr5 :nth-child(' + (j - 1) + ')').text(),
			tr3 = +$('#tr3 :nth-child(' + j + ')').text(),
			tr4 = +$('#tr4 :nth-child(' + j + ')').text(),
			result = tr3 - tr5 - tr4 + secure;
		if (result > 0)
			$('#tr6 :nth-child(' + j + ')').text(result);
	}

	function OutPut(x) {
		var j = x + 1,
			tr6 = +$('#tr6 :nth-child(' + j + ')').text(),
			// result = (tr6 % batch == 0) ? tr6 : (tr6 + (batch - (tr6 % batch)));
			result = Math.ceil(tr6 / batch) * batch;
		if (result > 0)
			$('#tr7 :nth-child(' + j + ')').text(result);
	}

	function InPut(j) {
		var result = (+$('#tr7 :nth-child(' + (j + 1) + ')').text()) / qua;
		result = Math.ceil(result);
		if (result > 0)
			$('#tr8 :nth-child(' + j + ')').text(result);
	}

	function Remain(j) {
		var ava,
			tr2,
			orders,
			tr7 = +$('#tr7 :nth-child(' + j + ')').text();
		ava = tr7;
		if (j == 3)
			ava += (plan + now);
		if (ava > 0) {
			var i = j + 1;
			if (j == 13) {
				orders = +$('#tr2 :nth-child(' + j + ')').text();
				if (ava - orders > 0)
					$('#tr9 :nth-child(' + j + ')').text(ava - orders);
				return;
			}
			if (i > 13)
				return;
			orders = +$('#tr2 :nth-child(' + j + ')').text();
			while (+$('#tr7 :nth-child(' + i + ')').text() == 0) {
				tr2 = +$('#tr2 :nth-child(' + i + ')').text();
				orders += tr2;
				i++;
				if (i > 13)
					break;
			}
			if (ava - orders > 0)
				$('#tr9 :nth-child(' + j + ')').text(ava - orders);
		}
	}
	$('#reset1').click(function () {
		$(window).attr('location', '#pageone');
		location.reload();
	});
	$('#reset2').click(function () {
		$(window).attr('location', '#pageone');
		location.reload();
	});
};