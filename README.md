# EqualizerCard
HomeAssistant card that shows vertical sliders.

Hi everyone,

I’m working on creating my first Home Assistant card, and I’m no expert when it comes to coding. I’d really appreciate any suggestions to improve the design or any help you can offer. Below is an example configuration:
type: custom:equalizer-card
height: 400px
color: orange
entities:
  - entity: input_number.speakers_eq_63
    name: 63hz
  - entity: input_number.speakers_eq_125
    name: 125hz
  - entity: input_number.speakers_eq_250
    name: 250hz
  - entity: input_number.speakers_eq_500
    name: 500hz
  - entity: input_number.speakers_eq_1k
    name: 1khz
  - entity: input_number.speakers_eq_2k
    name: 2khz
  - entity: input_number.speakers_eq_4k
    name: 4khz
  - entity: input_number.speakers_eq_8k
    name: 8khz
  - entity: input_number.speakers_eq_16k
    name: 16khz

The sliders do not work refined, and the color does not change.
