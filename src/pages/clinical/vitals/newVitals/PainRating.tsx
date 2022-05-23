import React from 'react'
import { images } from "utils/constants";

export default function PainRating() {
  return (
    <div style={{ display: "flex", padding: "12px 0", columnGap: "25px", flexWrap: "wrap" }}>
      <div>
        <img src={images.noHurt} />
        <div style={{ textAlign: "center" }}>
          <span className="text-20 font-bold">0</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span className="text-14 font-medium">No Hurt</span>
        </div>
      </div>
      <div>
        <img src={images.hurtLittleBit} />
        <div style={{ textAlign: "center" }}>
          <span className="text-20 font-bold">2</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span className="text-14 font-medium">Hurts Little Bit</span>
        </div>
      </div>
      <div>
        <img src={images.hurtLittleMore} />
        <div style={{ textAlign: "center" }}>
          <span className="text-20 font-bold">4</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span className="text-14 font-medium">Hurts Little More</span>
        </div>
      </div>
      <div>
        <img src={images.hurtEvenMore} />
        <div style={{ textAlign: "center" }}>
          <span className="text-20 font-bold">6</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span className="text-14 font-medium">Hurts Even More</span>
        </div>
      </div>
      <div>
        <img src={images.hurtWholeLot} />
        <div style={{ textAlign: "center" }}>
          <span className="text-20 font-bold">8</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span className="text-14 font-medium">Hurts Whole Lot</span>
        </div>
      </div>

      <div>
        <img src={images.hurtWorst} />
        <div style={{ textAlign: "center" }}>
          <span className="text-20 font-bold">10</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span className="text-14 font-medium">Hurts Worst</span>
        </div>
      </div>
    </div>
  )
}
