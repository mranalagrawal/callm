<template>
  <div class="loader">
    <div class="wrapper shadow">
      <div class="bottle">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="26.81px"
          height="106.124px"
          viewBox="0 0.5 26.81 106.124"
          enable-background="new 0 0.5 26.81 106.124"
          xml:space="preserve"
        >
          <defs>
            <pattern
              id="water_fill"
              width=".25"
              height="1.1"
              patternContentUnits="objectBoundingBox"
            >
              <path
                fill="#992645"
                d="M0.25,1H0c0,0,0-0.659,0-0.916c0.083-0.303,0.158,0.334,0.25,0C0.25,0.327,0.25,1,0.25,1z"
              />
            </pattern>
            <path
              id="bottle"
              d="M17.905,38.109V9.734c0,0,1.75-3.125,1.375-5.5s-5.875-2.232-5.875-2.232s-5.5-0.143-5.875,2.232
	s1.375,5.5,1.375,5.5v28.375c0,0-7.405,1.311-7.405,16.03s0,40.72,0,45.47s5.515,5.515,5.515,5.515h6.39h6.39
	c0,0,5.515-0.765,5.515-5.515s0-30.75,0-45.47S17.905,38.109,17.905,38.109z"
            />
            <mask id="bottle_mask">
              <use
                x="0"
                y="0"
                xlink:href="#bottle"
                opacity="1"
                fill="#ffffff"
              />
            </mask>
          </defs>
          <rect
            class="bottle-fill"
            mask="url(#bottle_mask)"
            fill="url(#water_fill)"
            x="-400"
            y="0"
            width="1600"
            height="120"
          />
          <path
            id="btl-out"
            fill="none"
            stroke="#333"
            stroke-width="3"
            stroke-miterlimit="10"
            d="M17.905,38.109V9.734
	c0,0,1.75-3.125,1.375-5.5s-5.875-2.232-5.875-2.232s-5.5-0.143-5.875,2.232s1.375,5.5,1.375,5.5v28.375
	c0,0-7.405,1.311-7.405,16.03s0,40.72,0,45.47s5.515,5.515,5.515,5.515h6.39h6.39c0,0,5.515-0.765,5.515-5.515s0-30.75,0-45.47
	S17.905,38.109,17.905,38.109z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.bottle-fill {
  animation: waves 2500ms infinite linear, fill 2500ms infinite forwards;
}

.bottle {
  opacity: 1;
  width: 40px;
  text-align: center;
  position: absolute;
  display: inline-block;
  vertical-align: bottom;

  animation: move 1500ms linear infinite;
}

@keyframes waves {
  0% {
    x: -200px;
  }
  25% {
    x: -100px;
  }
  50% {
    x: -200px;
  }
  75%,
  100% {
    x: -40px;
  }
}
@keyframes fill {
  0% {
    height: 0;
    y: 125px;
  }
  30%,
  100% {
    height: 100px;
    y: 25px;
  }
}

@keyframes move {
  0% {
    transform: rotateZ(-30deg);
  }
  100% {
    transform: rotateZ(30deg);
  }
}

:deep(.modal-footer),
:deep(.modal-header) {
  border: 0px;
}
:deep(.modal-content) {
  height: 100vh;
}
</style>
