function loadWidget(config) {
	let { waifuPath, apiPath, cdnPath } = config;
	let useCDN = false, modelList;
	if (typeof cdnPath === "string") {
		useCDN = true;
		if (!cdnPath.endsWith("/")) cdnPath += "/";
	} else if (typeof apiPath === "string") {
		if (!apiPath.endsWith("/")) apiPath += "/";
	} else {
		console.error("Invalid initWidget argument!");
		return;
	}
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu">
			<div id="waifu-tips"></div>
			<canvas id="live2d" width="800" height="800"></canvas>
			<div id="waifu-tools">
				<span class="fa fa-lg fa-times"></span>
				<span class="fa fa-lg fa-user-circle"></span>
			</div>
		</div>`);
	setTimeout(() => {
		document.getElementById("waifu").style.bottom = 0;
	}, 0);

	function randomSelection(obj) {
		return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
	}
	let userAction = false,
		userActionTimer,
		messageTimer,
		messageArray = ["Hai~ Ayo bermain denganku! "];
	window.addEventListener("mousemove", () => userAction = true);
	window.addEventListener("keydown", () => userAction = true);
	setInterval(() => {
		if (userAction) {
			userAction = false;
			clearInterval(userActionTimer);
			userActionTimer = null;
		} else if (!userActionTimer) {
			userActionTimer = setInterval(() => {
				showMessage(randomSelection(messageArray), 6000, 9);
			}, 20000);
		}
	}, 1000);

	(function registerEventListener() {
	    document.querySelector("#waifu-tools .fa-user-circle").addEventListener("click", loadOtherModel);
		document.querySelector("#waifu-tools .fa-times").addEventListener("click", () => {
			localStorage.setItem("waifu-display", Date.now());
			showMessage("Sampai Jumpa Lagi.", 2000, 11);
			document.getElementById("waifu").style.bottom = "-500px";
			setTimeout(() => {
				document.getElementById("waifu").style.display = "none";
				document.getElementById("waifu-toggle").classList.add("waifu-toggle-active");
			}, 3000);
		});
		const devtools = () => {};
		console.log("%c", devtools);
		devtools.toString = () => {
			showMessage("Haha, apakah kamu ingin melihat rahasia kecilku?", 6000, 9);
		};
		window.addEventListener("copy", () => {
			showMessage("Apa yang telah Anda salin? Ingatlah untuk menambahkan sumber untuk dicetak ulang!", 6000, 9);
		});
		window.addEventListener("visibilitychange", () => {
			if (!document.hidden) showMessage("Wow, akhirnya kamu kembali~", 6000, 9);
		});
	})();

	(function welcomeMessage() {
		let text;
		if (location.pathname === "/") { // 如果是主页
			const now = new Date().getHours();
			if (now > 5 && now <= 7) text = "Ohayou Gozaimasu";
			else if (now > 7 && now <= 11) text = "Selamat pagi! Bekerja dengan baik, jangan males trus";
			else if (now > 11 && now <= 13) text = "Sudah siang, sudah bekerja sepanjang pagi, dan waktunya makan siang!";
			else if (now > 13 && now <= 17) text = "Sore hari gampang ngantuk, tapi jangan tidur ya";
			else if (now > 17 && now <= 19) text = "Ini sudah malam! Matahari terbenam di luar jendela sangat indah, paling indah tapi matahari terbenam berwarna merah~";
			else if (now > 19 && now <= 21) text = "Selamat malam, bagaimana kabarmu hari ini?";
			else if (now > 21 && now <= 23) text = ["Oyasumi nasai", "selamat malam~", "Jaga kesehatanmu, yuk tidur!"];
			else text = "Apakah kamu kelelawar? Jika kamu belum tidur hingga tengah malam, apakah kamu akan bangun besok?";
		} else if (document.referrer !== "") {
			const referrer = new URL(document.referrer),
				domain = referrer.hostname.split(".")[1];
			if (location.hostname === referrer.hostname) text = `Selamat Datang`;
		} else {
			text = `Irasshaimase Mina San`;
		}
		showMessage(text, 7000, 8);
	})();

	function showHitokoto() {
		fetch("https://v1.hitokoto.cn")
			.then(response => response.json())
			.then(result => {
				const text = `Ara Ara`;
				showMessage(result.hitokoto, 6000, 9);
				setTimeout(() => {
					showMessage(text, 4000, 9);
				}, 6000);
			});
	}

	function showMessage(text, timeout, priority) {
		if (!text || (sessionStorage.getItem("waifu-text") && sessionStorage.getItem("waifu-text") > priority)) return;
		if (messageTimer) {
			clearTimeout(messageTimer);
			messageTimer = null;
		}
		text = randomSelection(text);
		sessionStorage.setItem("waifu-text", priority);
		const tips = document.getElementById("waifu-tips");
		tips.innerHTML = text;
		tips.classList.add("waifu-tips-active");
		messageTimer = setTimeout(() => {
			sessionStorage.removeItem("waifu-text");
			tips.classList.remove("waifu-tips-active");
		}, timeout);
	}

	(function initModel() {
		let modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (modelId === null) {
			modelId = 1; 
			modelTexturesId = 53; 
		}
		loadModel(modelId, modelTexturesId);
		fetch(waifuPath)
			.then(response => response.json())
			.then(result => {
				window.addEventListener("mouseover", event => {
					for (let { selector, text } of result.mouseover) {
						if (!event.target.matches(selector)) continue;
						text = randomSelection(text);
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
						return;
					}
				});
				window.addEventListener("click", event => {
					for (let { selector, text } of result.click) {
						if (!event.target.matches(selector)) continue;
						text = randomSelection(text);
						text = text.replace("{text}", event.target.innerText);
						showMessage(text, 4000, 8);
						return;
					}
				});
				result.seasons.forEach(({ date, text }) => {
					const now = new Date(),
						after = date.split("-")[0],
						before = date.split("-")[1] || after;
					if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
						text = randomSelection(text);
						text = text.replace("{year}", now.getFullYear());
						//showMessage(text, 7000, true);
						messageArray.push(text);
					}
				});
			});
	})();

	async function loadModelList() {
		const response = await fetch(`${cdnPath}model_list.json`);
		modelList = await response.json();
	}

	async function loadModel(modelId, modelTexturesId, message) {
		localStorage.setItem("modelId", modelId);
		localStorage.setItem("modelTexturesId", modelTexturesId);
		showMessage(message, 4000, 10);
		if (useCDN) {
			if (!modelList) await loadModelList();
			const target = randomSelection(modelList.models[modelId]);
			loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
		} else {
			loadlive2d("live2d", `${apiPath}get/?id=${modelId}-${modelTexturesId}`);
			console.log(`Live2D 模型 ${modelId}-${modelTexturesId} 加载完成`);
		}
	}

	async function loadRandModel() {
		const modelId = localStorage.getItem("modelId"),
			modelTexturesId = localStorage.getItem("modelTexturesId");
		if (useCDN) {
			if (!modelList) await loadModelList();
			const target = randomSelection(modelList.models[modelId]);
			loadlive2d("live2d", `${cdnPath}model/${target}/index.json`);
			showMessage("我的新衣服好看嘛？", 4000, 10);
		} else {
			fetch(`${apiPath}rand_textures/?id=${modelId}-${modelTexturesId}`)
				.then(response => response.json())
				.then(result => {
					if (result.textures.id === 1 && (modelTexturesId === 1 || modelTexturesId === 0)) showMessage("我还没有其他衣服呢！", 4000, 10);
					else loadModel(modelId, result.textures.id, "我的新衣服好看嘛？");
				});
		}
	}

	async function loadOtherModel() {
		let modelId = localStorage.getItem("modelId");
		if (useCDN) {
			if (!modelList) await loadModelList();
			const index = (++modelId >= modelList.models.length) ? 0 : modelId;
			loadModel(index, 0, modelList.messages[index]);
		} else {
			fetch(`${apiPath}switch/?id=${modelId}`)
				.then(response => response.json())
				.then(result => {
					loadModel(result.model.id, 0, result.model.message);
				});
		}
	}
}

function initWidget(config, apiPath) {
	if (typeof config === "string") {
		config = {
			waifuPath: config,
			apiPath
		};
	}
	document.body.insertAdjacentHTML("beforeend", `<div id="waifu-toggle">
			<span>Asistent</span>
		</div>`);
	const toggle = document.getElementById("waifu-toggle");
	toggle.addEventListener("click", () => {
		toggle.classList.remove("waifu-toggle-active");
		if (toggle.getAttribute("first-time")) {
			loadWidget(config);
			toggle.removeAttribute("first-time");
		} else {
			localStorage.removeItem("waifu-display");
			document.getElementById("waifu").style.display = "";
			setTimeout(() => {
				document.getElementById("waifu").style.bottom = 0;
			}, 0);
		}
	});
	if (localStorage.getItem("waifu-display") && Date.now() - localStorage.getItem("waifu-display") <= 86400000) {
		toggle.setAttribute("first-time", true);
		setTimeout(() => {
			toggle.classList.add("waifu-toggle-active");
		}, 0);
	} else {
		loadWidget(config);
	}
}
