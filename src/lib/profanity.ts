import { Profanity, ProfanityOptions } from "@2toad/profanity";

const options = new ProfanityOptions();
options.wholeWord = false; // catch profanity embedded in usernames
options.grawlix = "****";

export const profanity = new Profanity(options);

// Add additional slurs and hate speech terms not in the default list
profanity.addWords([
  "kike", "kyke",
  "goyim",
  "heeb", "hebe",
  "shylock",
  "wetback",
  "beaner",
  "zipperhead",
  "gook",
  "raghead", "towelhead",
  "camelj0ckey",
  "redskin",
  "gringo",
  "honkey", "honky",
  "cracker",
  "whitepower", "white_power",
  "heilhitler", "heil_hitler",
  "sieg_heil", "siegheil",
  "1488", "1352",
  "gasthejews", "gas_the_jews",
]);
