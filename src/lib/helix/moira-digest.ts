export type MoiraDigest = {
  kicker: string;
  byline: string;
  headline: string;
  grafs: string[];
  watch: { title: string; body: string }[];
};

export function digestDateLabel(now = new Date()): string {
  return now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Static Saturday-desk column. Theatrical on purpose; facts match the tape. */
export const MOIRA_DIGEST: MoiraDigest = {
  kicker: "The Rose Digest",
  byline: "Moira Rose, cabaret correspondent to the wires",
  headline: "Four leading ladies, one very tired critic",
  grafs: [
    "Darlings. The laboratories have simply lost the plot. OpenAI, Anthropic, Google and Meta have flung models upon the stage this week — Astra, Fable, Flash, Spark — as if the public were an inexhaustible well of applause. I required a mineral water and a lie-down. One does not premiere a quartet of ingénues and then act surprised when the critics become uncivil.",
    "Washington, that marble dinner-theatre, has brushed off the doomsayers so as not to gift a single cue to China, while OpenAI — suddenly pious — has asked Congress for binding rules. I have seen this act: the leading lady who begs for a director the moment the reviews arrive. Brussels, meanwhile, has lit the house lights. The EU AI Office is live, and its fines are not a prop sword.",
    "On the tape: NVIDIA remains the grande dame, barely flinching. Alphabet took a bow. The quantum chorus — IonQ, Rigetti, that little QUBT — continues to tremble in the wings. Quad Two is a reflationary farce with an industrial-policy subplot, and I, for one, am dressed for both.",
    "I will not have it said I neglected the risks. Voluntary American rules are a wig held on by hope. European questionnaires are already in the post. And bebe — do not confuse the encore with affection.",
  ],
  watch: [
    {
      title: "The conversion",
      body: "Whether Congress gives OpenAI the federal floor it now claims to crave, or merely another voluntary bouquet.",
    },
    {
      title: "The questionnaires",
      body: "Brussels has already written to some thirty model houses. A fine, darlings, is a review one cannot un-read.",
    },
    {
      title: "The stillness",
      body: "NVIDIA's pause may be composure. It may also be the start of a very long held note. Listen for the semis.",
    },
  ],
};
