import React from 'react'
import { useLanguage } from '../../hooks/useLanguage.js';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

function SocialProof() {
  const { t } = useLanguage();
  return (
    <section className="py-12 bg-white/50  backdrop-blur-sm border-y ">
    <div className="max-w-[1280px] mx-auto px-6 text-center">
      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">
      {t("stats.title")}
      </p>
      {/* Logo */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-60">
        <div
          className="h-8 w-24 bg-contain bg-center bg-no-repeat"
          data-alt="Google Logo"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBvWHqnRWYtzYaA0oFe-el4SRYV2NniAm_TYyTca42KW6IsDfMc-SjKUw-z0lLxk2MLqe2-T8FInQs3bqaEqUrkLezymcSRnSGnw67HQoTFW13dGTD17LlV0dMLbxKBt8LHPF3p2suM7fePnR_hwqOrAngsZzruW9HD6sy2UIt5idsyghfHYfr5NDCLVwXFOiIZ4G9yP2g9j6fTM5Pg4wuhjT8MVXaejImDfYsIQmHJgxLldeL7mLKxGKJpNtaTLmEVu37qAN2NKA')" }}
        />
        <div
          className="h-8 w-24 bg-contain bg-center bg-no-repeat"
          data-alt="IBM Logo"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMEJGUv0L-e0n7prZmE4poV9bGnWiOMG1gq9R25ffNw1dFoeJ-J-vLfUfw_N1x6RxXdSNND9nPQFi1-h6mg-g_deBppHeHjtWr5QE1JcybJYGxL2UeXbrkOvcIYT1uOKk4xRp1KDZTb1rg0-WlElkcbDIGsDQOLhvnlNijJmMLKqmvgaGvOI_xiY550gawhaodzUFDyZf_dZlvbtPXtCtDgKFSwtYqv5TOrkYkyfnfb9v8jZrkeVNtCE29PEvB1dTC9lkp_A1SiQ')" }}
        />
        <div
          className="h-8 w-24 bg-contain bg-center bg-no-repeat"
          data-alt="Microsoft Logo"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiSdY9lpkSQTlvUTkh9aKEhqFCoZkz24hkktxy4gOfYWkymdbwXC1WtgT0LNNYLNQ7aApZVeXA_-QP3RCQhCAeOnaOWwzL7svdJgC6jYg7ixEcoKRbFotep8Ir3SZ5TY6NJNtC5_0o5Si6uYCThKWNWFHc_F8Fvv5HJXMghlqM99qpVvNfs3VcXMi9ryMuCQOYSCkMNA0EZIP2iDSZws2w_6B5V_Wf031ZqHERKFm8zw2HY8_qiRxf66UmX-kMSIBtXI1CIUkJlw')" }}
        />
        <div
          className="h-8 w-24 bg-contain bg-center bg-no-repeat"
          data-alt="Netflix Logo"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC05a2kono4quJkkWMhr8KNX8g4nXsus-jJ-A-qOP1VaLBeAMgGTwKNFKeS-d4yVqh2dmfHRlcbjAdAXQLJkvD9ptBtabFchryxdx2OFeroa2Rwnkasj4L16rnfphIEfoySVkOM92jqfnC6S0gNeDOPaYMW313B7MLdel0letQGAiETHfxmB61I1JYhv2oYlGISv_ntNZXBWnlNb20xMUnLHW2e8JcRJGT_AF7hyLUcXKvc28FyPAnYFs76pcvLGstOkt1rM4tuXw')" }}
        />
        <div
          className="h-8 w-24 bg-contain bg-center bg-no-repeat"
          data-alt="Amazon Logo"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBa1D3OFXHCdkDAtFbmgWK01BDPt0yniwfKkWLOfc-W7ZbRwafwxUZkk2SUN_4obfmIfcjkLx-qmLJNiWcwfhISULzjq3GSkHWLXVpTZCy5EI1A9buohiKmcgWi2V2JcA7yr7gdp3wm6e986XryUN6EbOnn0ddcYVTVKot1QUA-QE8cgDl4UmXOaYWslfjduwKO_z1-0VAlIi8ZVTDsC-UBx8qwSFuqe51szQSGsdGXbZwhAHr7EI0f6fO85zJPLyytQlTWah5ew')" }}
        />
      </div>
      {/* text */}
      <div className="mt-8">
        <a className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline" href="#">
          Become our partner
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>
    </div>
  </section>
  )
}

export default  SocialProof;