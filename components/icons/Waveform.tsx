'use client';
import React, { useEffect, useRef } from 'react';

const Waveform: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const startColor = '#41288A';
  const endColor = 'white';
  const speed = 30; // delay in ms between each path

  useEffect(() => {
    let paths = Array.from(svgRef.current?.querySelectorAll('path') || []);
    if (!paths.length) return;

    // sort all paths left → right based on their x position
    paths.sort((a, b) => a.getBBox().x - b.getBBox().x);

    // start in reverse (right → left)
    let forward = true;

    const animate = () => {
      // choose order based on direction
      const orderedPaths = forward ? paths : [...paths].reverse();

      orderedPaths.forEach((path, i) => {
        setTimeout(() => {
          path.setAttribute('fill', forward ? endColor : startColor);
        }, i * speed);
      });

      // flip direction for next iteration
      forward = !forward;
    };

    animate();

    const interval = setInterval(() => {
      animate();
    }, paths.length * speed);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      width="624"
      height="318"
      viewBox="0 0 624 318"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <g filter="url(#filter0_d_138_6091)">
            <path d="M19.2884 154.86V153.357L18.6442 152.284L18 153.357V155.075V156.793L18.6442 158.296L19.2884 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter1_d_138_6091)">
            <path d="M26.1595 154.738V152.805L25.5153 151.425L24.8711 152.805V155.014V157.222L25.5153 159.155L26.1595 157.222V154.738Z" fill="white" />
        </g>
        <g filter="url(#filter2_d_138_6091)">
            <path d="M564.693 154.86V153.357L564.048 152.284L563.404 153.357V155.075V156.793L564.048 158.296L564.693 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter3_d_138_6091)">
            <path d="M581.87 154.86V153.357L581.226 152.284L580.582 153.357V155.075V156.793L581.226 158.296L581.87 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter4_d_138_6091)">
            <path d="M599.049 154.86V153.357L598.404 152.284L597.76 153.357V155.075V156.793L598.404 158.296L599.049 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter5_d_138_6091)">
            <path d="M571.564 154.738V152.805L570.92 151.425L570.275 152.805V155.014V157.222L570.92 159.155L571.564 157.222V154.738Z" fill="white" />
        </g>
        <g filter="url(#filter6_d_138_6091)">
            <path d="M588.742 154.738V152.805L588.098 151.425L587.454 152.805V155.014V157.222L588.098 159.155L588.742 157.222V154.738Z" fill="white" />
        </g>
        <g filter="url(#filter7_d_138_6091)">
            <path d="M605.92 154.738V152.805L605.276 151.425L604.632 152.805V155.014V157.222L605.276 159.155L605.92 157.222V154.738Z" fill="white" />
        </g>
        <g filter="url(#filter8_d_138_6091)">
            <path d="M33.031 154.615V152.253L32.3869 150.566L31.7427 152.253V154.952V157.652L32.3869 160.014L33.031 157.652V154.615Z" fill="white" />
        </g>
        <g filter="url(#filter9_d_138_6091)">
            <path d="M39.9021 154.492V151.701L39.2579 149.707L38.6138 151.701V154.891V158.081L39.2579 160.873L39.9021 158.081V154.492Z" fill="white" />
        </g>
        <g filter="url(#filter10_d_138_6091)">
            <path d="M46.7732 154.369V151.149L46.129 148.848L45.4849 151.149V154.83V158.511L46.129 161.732L46.7732 158.511V154.369Z" fill="white" />
        </g>
        <g filter="url(#filter11_d_138_6091)">
            <path d="M53.6443 154.492V148.695L53.0001 144.553L52.356 148.695V155.32V161.946L53.0001 167.744L53.6443 161.946V154.492Z" fill="white" />
        </g>
        <g filter="url(#filter12_d_138_6091)">
            <path d="M60.5159 153.265V146.179L59.8717 141.118L59.2275 146.179V154.277V162.376L59.8717 169.462L60.5159 162.376V153.265Z" fill="white" />
        </g>
        <g filter="url(#filter13_d_138_6091)">
            <path d="M67.387 152.897V144.523L66.7428 138.541L66.0986 144.523V154.093V163.664L66.7428 172.038L67.387 163.664V152.897Z" fill="white" />
        </g>
        <g filter="url(#filter14_d_138_6091)">
            <path d="M74.2581 152.529V142.866L73.6139 135.964L72.9697 142.866V153.909V164.952L73.6139 174.615L74.2581 164.952V152.529Z" fill="white" />
        </g>
        <g filter="url(#filter15_d_138_6091)">
            <path d="M81.1297 152.038V140.658L80.4855 132.529L79.8413 140.658V153.664V166.67L80.4855 178.051L81.1297 166.67V152.038Z" fill="white" />
        </g>
        <g filter="url(#filter16_d_138_6091)">
            <path d="M88.0008 151.179V136.793L87.3566 126.516L86.7124 136.793V153.234V169.676L87.3566 184.063L88.0008 169.676V151.179Z" fill="white" />
        </g>
        <g filter="url(#filter17_d_138_6091)">
            <path d="M94.8719 150.32V132.928L94.2277 120.504L93.5835 132.928V152.805V172.683L94.2277 190.075L94.8719 172.683V150.32Z" fill="white" />
        </g>
        <g filter="url(#filter18_d_138_6091)">
            <path d="M101.743 149.584V129.615L101.099 115.351L100.455 129.615V152.437V175.259L101.099 195.229L101.743 175.259V149.584Z" fill="white" />
        </g>
        <g filter="url(#filter19_d_138_6091)">
            <path d="M108.615 148.603V125.197L107.97 108.479L107.326 125.197V151.946V178.695L107.97 202.1L108.615 178.695V148.603Z" fill="white" />
        </g>
        <g filter="url(#filter20_d_138_6091)">
            <path d="M115.486 148.234V123.541L114.841 105.903L114.197 123.541V151.762V179.983L114.841 204.677L115.486 179.983V148.234Z" fill="white" />
        </g>
        <g filter="url(#filter21_d_138_6091)">
            <path d="M122.357 150.075V131.823L121.713 118.786L121.068 131.823V152.682V173.541L121.713 191.793L122.357 173.541V150.075Z" fill="white" />
        </g>
        <g filter="url(#filter22_d_138_6091)">
            <path d="M129.228 151.179V136.793L128.584 126.516L127.94 136.793V153.234V169.676L128.584 184.063L129.228 169.676V151.179Z" fill="white" />
        </g>
        <g filter="url(#filter23_d_138_6091)">
            <path d="M136.099 152.529V142.866L135.455 135.964L134.811 142.866V153.909V164.952L135.455 174.615L136.099 164.952V152.529Z" fill="white" />
        </g>
        <g filter="url(#filter24_d_138_6091)">
            <path d="M142.97 152.897V144.523L142.326 138.541L141.682 144.523V154.093V163.664L142.326 172.038L142.97 163.664V152.897Z" fill="white" />
        </g>
        <g filter="url(#filter25_d_138_6091)">
            <path d="M149.842 153.265V146.179L149.197 141.118L148.553 146.179V154.277V162.376L149.197 169.462L149.842 162.376V153.265Z" fill="white" />
        </g>
        <g filter="url(#filter26_d_138_6091)">
            <path d="M156.713 153.388V146.731L156.069 141.977L155.425 146.731V154.339V161.946L156.069 168.603L156.713 161.946V153.388Z" fill="white" />
        </g>
        <g filter="url(#filter27_d_138_6091)">
            <path d="M163.584 153.388V146.731L162.94 141.977L162.296 146.731V154.339V161.946L162.94 168.603L163.584 161.946V153.388Z" fill="white" />
        </g>
        <g filter="url(#filter28_d_138_6091)">
            <path d="M170.455 153.02V145.075L169.811 139.4L169.167 145.075V154.155V163.235L169.811 171.179L170.455 163.235V153.02Z" fill="white" />
        </g>
        <g filter="url(#filter29_d_138_6091)">
            <path d="M177.327 151.793V139.553L176.683 130.811L176.039 139.553V153.541V167.529L176.683 179.769L177.327 167.529V151.793Z" fill="white" />
        </g>
        <g filter="url(#filter30_d_138_6091)">
            <path d="M184.198 149.584V129.615L183.554 115.351L182.91 129.615V152.437V175.259L183.554 195.229L184.198 175.259V149.584Z" fill="white" />
        </g>
        <g filter="url(#filter31_d_138_6091)">
            <path d="M191.069 149.584V129.615L190.425 115.351L189.781 129.615V152.437V175.259L190.425 195.229L191.069 175.259V149.584Z" fill="white" />
        </g>
        <g filter="url(#filter32_d_138_6091)">
            <path d="M198.37 144.799V108.081L197.511 81.8534L196.652 108.081V150.044V192.008L197.511 228.726L198.37 192.008V144.799Z" fill="white" />
        </g>
        <g filter="url(#filter33_d_138_6091)">
            <path d="M205.241 140.627V89.3075L204.382 52.6507L203.523 89.3075V147.958V206.609L204.382 257.929L205.241 206.609V140.627Z" fill="white" />
        </g>
        <g filter="url(#filter34_d_138_6091)">
            <path d="M212.112 137.928V77.1601L211.253 33.7548L210.395 77.1601V146.609V216.057L211.253 276.825L212.112 216.057V137.928Z" fill="white" />
        </g>
        <g filter="url(#filter35_d_138_6091)">
            <path d="M218.983 135.105V64.4606L218.125 14L217.266 64.4606V145.198V225.935L218.125 296.579L218.983 225.935V135.105Z" fill="white" />
        </g>
        <g filter="url(#filter36_d_138_6091)">
            <path d="M416.102 154.86V153.357L416.746 152.284L417.391 153.357V155.075V156.793L416.746 158.296L416.102 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter37_d_138_6091)">
            <path d="M558.251 154.86V153.357L558.895 152.284L559.539 153.357V155.075V156.793L558.895 158.296L558.251 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter38_d_138_6091)">
            <path d="M575.429 154.86V153.357L576.073 152.284L576.717 153.357V155.075V156.793L576.073 158.296L575.429 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter39_d_138_6091)">
            <path d="M592.607 154.86V153.357L593.251 152.284L593.896 153.357V155.075V156.793L593.251 158.296L592.607 156.793V154.86Z" fill="white" />
        </g>
        <g filter="url(#filter40_d_138_6091)">
            <path d="M409.231 154.738V152.805L409.875 151.425L410.519 152.805V155.014V157.222L409.875 159.155L409.231 157.222V154.738Z" fill="white" />
        </g>
        <g filter="url(#filter41_d_138_6091)">
            <path d="M551.38 154.738V152.805L552.024 151.425L552.668 152.805V155.014V157.222L552.024 159.155L551.38 157.222V154.738Z" fill="white" />
        </g>
        <g filter="url(#filter42_d_138_6091)">
            <path d="M402.36 154.615V152.253L403.004 150.566L403.648 152.253V154.952V157.652L403.004 160.014L402.36 157.652V154.615Z" fill="white" />
        </g>
        <g filter="url(#filter43_d_138_6091)">
            <path d="M544.509 154.615V152.253L545.153 150.566L545.797 152.253V154.952V157.652L545.153 160.014L544.509 157.652V154.615Z" fill="white" />
        </g>
        <g filter="url(#filter44_d_138_6091)">
            <path d="M395.488 154.492V151.701L396.133 149.707L396.777 151.701V154.891V158.081L396.133 160.873L395.488 158.081V154.492Z" fill="white" />
        </g>
        <g filter="url(#filter45_d_138_6091)">
            <path d="M537.637 154.492V151.701L538.281 149.707L538.925 151.701V154.891V158.081L538.281 160.873L537.637 158.081V154.492Z" fill="white" />
        </g>
        <g filter="url(#filter46_d_138_6091)">
            <path d="M388.617 154.369V151.149L389.261 148.848L389.905 151.149V154.83V158.511L389.261 161.732L388.617 158.511V154.369Z" fill="white" />
        </g>
        <g filter="url(#filter47_d_138_6091)">
            <path d="M530.766 154.369V151.149L531.41 148.848L532.054 151.149V154.83V158.511L531.41 161.732L530.766 158.511V154.369Z" fill="white" />
        </g>
        <g filter="url(#filter48_d_138_6091)">
            <path d="M381.746 154.492V148.695L382.39 144.553L383.034 148.695V155.32V161.946L382.39 167.744L381.746 161.946V154.492Z" fill="white" />
        </g>
        <g filter="url(#filter49_d_138_6091)">
            <path d="M523.895 154.492V148.695L524.539 144.553L525.183 148.695V155.32V161.946L524.539 167.744L523.895 161.946V154.492Z" fill="white" />
        </g>
        <g filter="url(#filter50_d_138_6091)">
            <path d="M374.875 153.265V146.179L375.519 141.118L376.163 146.179V154.277V162.376L375.519 169.462L374.875 162.376V153.265Z" fill="white" />
        </g>
        <g filter="url(#filter51_d_138_6091)">
            <path d="M517.023 152.774V146.977L517.882 142.836L518.741 146.977V153.603V160.228L517.882 166.026L517.023 160.228V152.774Z" fill="white" />
        </g>
        <g filter="url(#filter52_d_138_6091)">
            <path d="M368.004 152.897V144.523L368.648 138.541L369.292 144.523V154.093V163.664L368.648 172.038L368.004 163.664V152.897Z" fill="white" />
        </g>
        <g filter="url(#filter53_d_138_6091)">
            <path d="M510.152 152.529V145.872L511.011 141.118L511.87 145.872V153.48V161.087L511.011 167.744L510.152 161.087V152.529Z" fill="white" />
        </g>
        <g filter="url(#filter54_d_138_6091)">
            <path d="M361.132 152.529V142.866L361.776 135.964L362.42 142.866V153.909V164.952L361.776 174.615L361.132 164.952V152.529Z" fill="white" />
        </g>
        <g filter="url(#filter55_d_138_6091)">
            <path d="M503.281 152.284V144.768L504.14 139.4L504.999 144.768V153.357V161.946L504.14 169.462L503.281 161.946V152.284Z" fill="white" />
        </g>
        <g filter="url(#filter56_d_138_6091)">
            <path d="M354.261 152.038V140.658L354.905 132.529L355.549 140.658V153.664V166.67L354.905 178.051L354.261 166.67V152.038Z" fill="white" />
        </g>
        <g filter="url(#filter57_d_138_6091)">
            <path d="M496.41 151.915V143.112L497.269 136.823L498.127 143.112V153.173V163.235L497.269 172.038L496.41 163.235V151.915Z" fill="white" />
        </g>
        <g filter="url(#filter58_d_138_6091)">
            <path d="M347.39 151.179V136.793L348.034 126.516L348.678 136.793V153.234V169.676L348.034 184.063L347.39 169.676V151.179Z" fill="white" />
        </g>
        <g filter="url(#filter59_d_138_6091)">
            <path d="M489.539 151.179V139.799L490.397 131.67L491.256 139.799V152.805V165.811L490.397 177.192L489.539 165.811V151.179Z" fill="white" />
        </g>
        <g filter="url(#filter60_d_138_6091)">
            <path d="M340.518 150.32V132.928L341.162 120.504L341.807 132.928V152.805V172.683L341.162 190.075L340.518 172.683V150.32Z" fill="white" />
        </g>
        <g filter="url(#filter61_d_138_6091)">
            <path d="M482.667 150.443V136.486L483.526 126.516L484.385 136.486V152.437V168.388L483.526 182.345L482.667 168.388V150.443Z" fill="white" />
        </g>
        <g filter="url(#filter62_d_138_6091)">
            <path d="M333.647 149.584V129.615L334.291 115.351L334.936 129.615V152.437V175.259L334.291 195.229L333.647 175.259V149.584Z" fill="white" />
        </g>
        <g filter="url(#filter63_d_138_6091)">
            <path d="M475.796 149.952V134.277L476.655 123.081L477.514 134.277V152.192V170.106L476.655 185.781L475.796 170.106V149.952Z" fill="white" />
        </g>
        <g filter="url(#filter64_d_138_6091)">
            <path d="M326.776 148.603V125.197L327.42 108.479L328.064 125.197V151.946V178.695L327.42 202.1L326.776 178.695V148.603Z" fill="white" />
        </g>
        <g filter="url(#filter65_d_138_6091)">
            <path d="M468.925 149.093V130.412L469.784 117.068L470.643 130.412V151.762V173.112L469.784 191.793L468.925 173.112V149.093Z" fill="white" />
        </g>
        <g filter="url(#filter66_d_138_6091)">
            <path d="M319.905 148.234V123.541L320.549 105.903L321.193 123.541V151.762V179.983L320.549 204.677L319.905 179.983V148.234Z" fill="white" />
        </g>
        <g filter="url(#filter67_d_138_6091)">
            <path d="M462.054 148.848V129.308L462.913 115.351L463.771 129.308V151.639V173.971L462.913 193.511L462.054 173.971V148.848Z" fill="white" />
        </g>
        <g filter="url(#filter68_d_138_6091)">
            <path d="M313.033 150.075V131.823L313.678 118.786L314.322 131.823V152.682V173.541L313.678 191.793L313.033 173.541V150.075Z" fill="white" />
        </g>
        <g filter="url(#filter69_d_138_6091)">
            <path d="M455.182 150.32V135.934L456.041 125.658L456.9 135.934V152.376V168.817L456.041 183.204L455.182 168.817V150.32Z" fill="white" />
        </g>
        <g filter="url(#filter70_d_138_6091)">
            <path d="M306.162 151.179V136.793L306.807 126.516L307.451 136.793V153.234V169.676L306.807 184.063L306.162 169.676V151.179Z" fill="white" />
        </g>
        <g filter="url(#filter71_d_138_6091)">
            <path d="M448.311 151.179V139.799L449.17 131.67L450.029 139.799V152.805V165.811L449.17 177.192L448.311 165.811V151.179Z" fill="white" />
        </g>
        <g filter="url(#filter72_d_138_6091)">
            <path d="M299.291 152.529V142.866L299.935 135.964L300.58 142.866V153.909V164.952L299.935 174.615L299.291 164.952V152.529Z" fill="white" />
        </g>
        <g filter="url(#filter73_d_138_6091)">
            <path d="M441.44 152.284V144.768L442.299 139.4L443.158 144.768V153.357V161.946L442.299 169.462L441.44 161.946V152.284Z" fill="white" />
        </g>
        <g filter="url(#filter74_d_138_6091)">
            <path d="M292.42 152.897V144.523L293.064 138.541L293.708 144.523V154.093V163.664L293.064 172.038L292.42 163.664V152.897Z" fill="white" />
        </g>
        <g filter="url(#filter75_d_138_6091)">
            <path d="M434.568 152.529V145.872L435.427 141.118L436.286 145.872V153.48V161.087L435.427 167.744L434.568 161.087V152.529Z" fill="white" />
        </g>
        <g filter="url(#filter76_d_138_6091)">
            <path d="M285.549 153.265V146.179L286.193 141.118L286.837 146.179V154.277V162.376L286.193 169.462L285.549 162.376V153.265Z" fill="white" />
        </g>
        <g filter="url(#filter77_d_138_6091)">
            <path d="M427.697 152.774V146.977L428.556 142.836L429.415 146.977V153.603V160.228L428.556 166.026L427.697 160.228V152.774Z" fill="white" />
        </g>
        <g filter="url(#filter78_d_138_6091)">
            <path d="M278.677 153.388V146.731L279.322 141.977L279.966 146.731V154.339V161.946L279.322 168.603L278.677 161.946V153.388Z" fill="white" />
        </g>
        <g filter="url(#filter79_d_138_6091)">
            <path d="M420.826 152.897V147.529L421.685 143.695L422.544 147.529V153.664V159.799L421.685 165.167L420.826 159.799V152.897Z" fill="white" />
        </g>
        <g filter="url(#filter80_d_138_6091)">
            <path d="M271.806 153.388V146.731L272.451 141.977L273.095 146.731V154.339V161.946L272.451 168.603L271.806 161.946V153.388Z" fill="white" />
        </g>
        <g filter="url(#filter81_d_138_6091)">
            <path d="M264.935 153.02V145.075L265.579 139.4L266.223 145.075V154.155V163.235L265.579 171.179L264.935 163.235V153.02Z" fill="white" />
        </g>
        <g filter="url(#filter82_d_138_6091)">
            <path d="M258.064 151.793V139.553L258.708 130.811L259.352 139.553V153.541V167.529L258.708 179.769L258.064 167.529V151.793Z" fill="white" />
        </g>
        <g filter="url(#filter83_d_138_6091)">
            <path d="M251.193 149.584V129.615L251.837 115.351L252.481 129.615V152.437V175.259L251.837 195.229L251.193 175.259V149.584Z" fill="white" />
        </g>
        <g filter="url(#filter84_d_138_6091)">
            <path d="M237.45 149.584V129.615L238.094 115.351L238.738 129.615V152.437V175.259L238.094 195.229L237.45 175.259V149.584Z" fill="white" />
        </g>
        <g filter="url(#filter85_d_138_6091)">
            <path d="M244.75 144.799V108.081L245.18 81.8534L245.609 108.081V150.044V192.008L245.18 228.726L244.75 192.008V144.799Z" fill="white" />
        </g>
        <g filter="url(#filter86_d_138_6091)">
            <path d="M231.008 140.627V89.3075L231.438 52.6507L231.867 89.3075V147.958V206.609L231.438 257.929L231.008 206.609V140.627Z" fill="white" />
        </g>
        <g filter="url(#filter87_d_138_6091)">
            <path d="M224.137 137.928V77.1601L224.567 33.7548L224.996 77.1601V146.609V216.057L224.567 276.825L224.137 216.057V137.928Z" fill="white" />
        </g>
        <g clip-path="url(#clip0_138_6091)">
            <g filter="url(#filter88_d_138_6091)">
                <path d="M19.2884 154.86V153.357L18.6442 152.284L18 153.357V155.075V156.793L18.6442 158.296L19.2884 156.793V154.86Z" fill="white" />
            </g>
            <g filter="url(#filter89_d_138_6091)">
                <path d="M26.1595 154.738V152.805L25.5153 151.425L24.8711 152.805V155.014V157.222L25.5153 159.155L26.1595 157.222V154.738Z" fill="white" />
            </g>
            <g filter="url(#filter90_d_138_6091)">
                <path d="M33.031 154.615V152.253L32.3869 150.566L31.7427 152.253V154.952V157.652L32.3869 160.014L33.031 157.652V154.615Z" fill="white" />
            </g>
            <g filter="url(#filter91_d_138_6091)">
                <path d="M39.9021 154.492V151.701L39.2579 149.707L38.6138 151.701V154.891V158.081L39.2579 160.873L39.9021 158.081V154.492Z" fill="white" />
            </g>
        </g>
        <defs>
            <filter id="filter0_d_138_6091" x="0.821917" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter1_d_138_6091" x="7.69301" y="137.682" width="35.6445" height="42.0863" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter2_d_138_6091" x="546.226" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter3_d_138_6091" x="563.404" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter4_d_138_6091" x="580.582" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter5_d_138_6091" x="553.097" y="137.682" width="35.6445" height="42.0863" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter6_d_138_6091" x="570.276" y="137.682" width="35.6445" height="42.0863" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter7_d_138_6091" x="587.454" y="137.682" width="35.6445" height="42.0863" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter8_d_138_6091" x="14.5646" y="136.823" width="35.6445" height="43.8041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter9_d_138_6091" x="21.4357" y="135.964" width="35.6445" height="45.5219" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter10_d_138_6091" x="28.3068" y="135.105" width="35.6445" height="47.2397" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter11_d_138_6091" x="35.1779" y="130.811" width="35.6445" height="57.5466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter12_d_138_6091" x="42.0495" y="127.375" width="35.6445" height="62.7" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter13_d_138_6091" x="48.9205" y="124.799" width="35.6445" height="67.8534" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter14_d_138_6091" x="55.7916" y="122.222" width="35.6445" height="73.0069" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter15_d_138_6091" x="62.6632" y="118.786" width="35.6445" height="79.8781" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter16_d_138_6091" x="69.5343" y="112.774" width="35.6445" height="91.9027" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter17_d_138_6091" x="76.4054" y="106.762" width="35.6445" height="103.927" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter18_d_138_6091" x="83.2765" y="101.608" width="35.6445" height="114.234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter19_d_138_6091" x="90.1481" y="94.737" width="35.6445" height="127.977" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter20_d_138_6091" x="97.0192" y="92.1602" width="35.6445" height="133.13" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter21_d_138_6091" x="103.89" y="105.044" width="35.6445" height="107.363" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter22_d_138_6091" x="110.762" y="112.774" width="35.6445" height="91.9027" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter23_d_138_6091" x="117.633" y="122.222" width="35.6445" height="73.0069" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter24_d_138_6091" x="124.504" y="124.799" width="35.6445" height="67.8534" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter25_d_138_6091" x="131.375" y="127.375" width="35.6445" height="62.7" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter26_d_138_6091" x="138.247" y="128.234" width="35.6445" height="60.9822" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter27_d_138_6091" x="145.118" y="128.234" width="35.6445" height="60.9822" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter28_d_138_6091" x="151.989" y="125.658" width="35.6445" height="66.1356" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter29_d_138_6091" x="158.86" y="117.069" width="35.6445" height="83.3137" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter30_d_138_6091" x="165.732" y="101.608" width="35.6445" height="114.234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter31_d_138_6091" x="172.603" y="101.608" width="35.6445" height="114.234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter32_d_138_6091" x="179.474" y="68.1109" width="36.0739" height="181.229" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter33_d_138_6091" x="186.345" y="38.9082" width="36.0739" height="239.634" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter34_d_138_6091" x="193.216" y="20.0123" width="36.0739" height="277.426" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter35_d_138_6091" x="200.088" y="0.257533" width="36.0739" height="316.936" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter36_d_138_6091" x="398.924" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter37_d_138_6091" x="541.073" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter38_d_138_6091" x="558.251" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter39_d_138_6091" x="575.429" y="138.541" width="35.6445" height="40.3685" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter40_d_138_6091" x="392.053" y="137.682" width="35.6445" height="42.0863" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter41_d_138_6091" x="534.202" y="137.682" width="35.6445" height="42.0863" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter42_d_138_6091" x="385.182" y="136.823" width="35.6445" height="43.8041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter43_d_138_6091" x="527.33" y="136.823" width="35.6445" height="43.8041" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter44_d_138_6091" x="378.31" y="135.964" width="35.6445" height="45.5219" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter45_d_138_6091" x="520.459" y="135.964" width="35.6445" height="45.5219" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter46_d_138_6091" x="371.439" y="135.105" width="35.6445" height="47.2397" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter47_d_138_6091" x="513.588" y="135.105" width="35.6445" height="47.2397" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter48_d_138_6091" x="364.568" y="130.811" width="35.6445" height="57.5466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter49_d_138_6091" x="506.717" y="130.811" width="35.6445" height="57.5466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter50_d_138_6091" x="357.697" y="127.375" width="35.6445" height="62.7" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter51_d_138_6091" x="499.845" y="129.093" width="36.0739" height="57.5466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter52_d_138_6091" x="350.826" y="124.799" width="35.6445" height="67.8534" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter53_d_138_6091" x="492.974" y="127.375" width="36.0739" height="60.9822" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter54_d_138_6091" x="343.954" y="122.222" width="35.6445" height="73.0069" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter55_d_138_6091" x="486.103" y="125.658" width="36.0739" height="64.4178" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter56_d_138_6091" x="337.083" y="118.786" width="35.6445" height="79.8781" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter57_d_138_6091" x="479.232" y="123.081" width="36.0739" height="69.5713" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter58_d_138_6091" x="330.212" y="112.774" width="35.6445" height="91.9027" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter59_d_138_6091" x="472.36" y="117.927" width="36.0739" height="79.8781" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter60_d_138_6091" x="323.34" y="106.762" width="35.6445" height="103.927" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter61_d_138_6091" x="465.489" y="112.774" width="36.0739" height="90.185" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter62_d_138_6091" x="316.469" y="101.608" width="35.6445" height="114.234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter63_d_138_6091" x="458.618" y="109.338" width="36.0739" height="97.0562" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter64_d_138_6091" x="309.598" y="94.737" width="35.6445" height="127.977" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter65_d_138_6091" x="451.747" y="103.326" width="36.0739" height="109.081" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter66_d_138_6091" x="302.727" y="92.1602" width="35.6445" height="133.13" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter67_d_138_6091" x="444.876" y="101.608" width="36.0739" height="112.516" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter68_d_138_6091" x="295.855" y="105.044" width="35.6445" height="107.363" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter69_d_138_6091" x="438.004" y="111.915" width="36.0739" height="91.9027" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter70_d_138_6091" x="288.984" y="112.774" width="35.6445" height="91.9027" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter71_d_138_6091" x="431.133" y="117.927" width="36.0739" height="79.8781" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter72_d_138_6091" x="282.113" y="122.222" width="35.6445" height="73.0069" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter73_d_138_6091" x="424.262" y="125.658" width="36.0739" height="64.4178" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter74_d_138_6091" x="275.242" y="124.799" width="35.6445" height="67.8534" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter75_d_138_6091" x="417.39" y="127.375" width="36.0739" height="60.9822" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter76_d_138_6091" x="268.371" y="127.375" width="35.6445" height="62.7" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter77_d_138_6091" x="410.519" y="129.093" width="36.0739" height="57.5466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter78_d_138_6091" x="261.499" y="128.234" width="35.6445" height="60.9822" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter79_d_138_6091" x="403.648" y="129.952" width="36.0739" height="55.8288" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter80_d_138_6091" x="254.628" y="128.234" width="35.6445" height="60.9822" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter81_d_138_6091" x="247.757" y="125.658" width="35.6445" height="66.1356" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter82_d_138_6091" x="240.886" y="117.069" width="35.6445" height="83.3137" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter83_d_138_6091" x="234.015" y="101.608" width="35.6445" height="114.234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter84_d_138_6091" x="220.272" y="101.608" width="35.6445" height="114.234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter85_d_138_6091" x="227.572" y="68.1109" width="35.2151" height="181.229" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter86_d_138_6091" x="213.83" y="38.9082" width="35.2151" height="239.634" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter87_d_138_6091" x="206.959" y="20.0123" width="35.2151" height="277.426" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="3.43562" />
                <feGaussianBlur stdDeviation="8.58904" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter88_d_138_6091" x="-2" y="132.284" width="41.2883" height="46.0123" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.254902 0 0 0 0 0.156863 0 0 0 0 0.541176 0 0 0 0.5 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter89_d_138_6091" x="4.87109" y="131.425" width="41.2883" height="47.7302" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.254902 0 0 0 0 0.156863 0 0 0 0 0.541176 0 0 0 0.5 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter90_d_138_6091" x="11.7427" y="130.566" width="41.2883" height="49.4479" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.254902 0 0 0 0 0.156863 0 0 0 0 0.541176 0 0 0 0.5 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <filter id="filter91_d_138_6091" x="18.6138" y="129.707" width="41.2883" height="51.1658" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.254902 0 0 0 0 0.156863 0 0 0 0 0.541176 0 0 0 0.5 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_6091" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_6091" result="shape" />
            </filter>
            <clipPath id="clip0_138_6091">
                <rect width="3" height="283" fill="white" transform="translate(18 14)" />
            </clipPath>
        </defs>
    </svg>
    );
};

export default Waveform;