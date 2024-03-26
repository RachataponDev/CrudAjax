<?php require_once "setting.php" ?>

<style>
	.body {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}
	.sign {
		display: none !important;
	}
	.bg {
		position: absolute;
		z-index: -1;
		pointer-events: none !important;
		background: url("assets/img/err/bg-02.png");
		height: 100vh;
		width: 100%;
		opacity: 0.9;
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.body .rigth {
		display: flex;
		justify-content: end;
		align-items: center;
	}
	.body .rigth img {
		margin-top: 100px;
		width: 520px;
		height: 560px;
	}
	.body .left,.body .rigth {
		width: 100%;
	}
	.body .left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.body .left p {
		font-size: 3rem;
		letter-spacing: 2px;
		font-family: 'Vina Sans', sans-serif;
		font-weight: bolder;
	}

</style>
<div class="bg"></div>
<div class="body">
	<div class="left" data-aos="zoom-in">
		<p><?= $err?></p>
	</div>
	<div class="rigth">
		<img data-aos="zoom-in-left" src="assets/img/err/bg-01.png" alt="">
	</div>
</div>
