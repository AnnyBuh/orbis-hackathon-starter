// FOUR SCENES. THE LINES NEVER CHANGE. ONLY THE BOARD CHANGES.
// variants[k].changes[n].steps = what Orbis is told after mother option n in that version of the
// scene: 2-3 single visible actions, sent one at a time a few seconds apart. Written to the Orbis
// prompt guide: never restate the world, one action per step, say changes explicitly, name the
// positive state. Endings carry targetChild / targetBoard: the look each path builds (review only).
// s1.image.prompt is what Orbis starts from (~100 words); referencePrompt is Anna's full version.
// All steps and targets are DRAFTS (2026-09-12) for Anna's review.
// The child asks the same question in every path. What differs is what the world
// on the floor looks like when it asks, and what happens after you answer.

const SCENES = {

s1:{ tag:"SCENE 1", rule:"RULE 1 · I am always at the right time, the right place, with the right people",
 image:{file:"images/start-child.jpg", prompt:"A curly brown-haired boy of about five, in a blue, yellow and white striped t-shirt, kneels barefoot on a living room rug beside a living miniature diorama that grows and transforms on its own, like a time-lapse. On its left: clay mountains, felt pine trees, a red barn, a cow and a tractor. In the middle: a felt river, a wooden bridge and a small town of houses with tiny people. On its right: a factory, a yellow crane and blue glass data center towers. The dark back of a TV fills the left foreground, casting cold blue light on him. Stop-motion miniature style. Medium wide shot, high angle, static camera, shallow depth of field.",
 referencePrompt:"STYLE AND ASPECT RATIO:\nHigh-quality stop-motion inspired 3D animated render. ASPECT RATIO 16:9 widescreen landscape, 1920x1080. Tilt-shift macro photography aesthetic, shallow depth of field. Not photorealistic, but highly detailed, resembling a beautifully handcrafted miniature diorama made of painted wood, felt, molded plastic, and clay. Nothing is kawaii; it is charmingly rustic, makeshift, and slightly surreal.\n\nCHARACTER — THE CHILD:\nA young boy, roughly 5 years old, with voluminous, tightly curled brown hair. He has large, innocent brown eyes, rosy cheeks, and a soft, focused smile. He is wearing a horizontal striped t-shirt (blue, yellow, and white). He is barefoot, kneeling on a soft, warm living room floor. His posture is leaning forward, with his small hands gently manipulating the miniature world in front of him.\n\nFOREGROUND — THE UNSEEN TV:\nIn the immediate left foreground, sitting on the edge of a wooden desk, is the dark, matte back casing of a large television monitor. The screen faces entirely away from the camera. We see ventilation vents, scuff marks, and AV cables (yellow, red, white) plugged into the back. The monitor emits a faint, harsh, cold blue-white glow that subtly spills onto the left side of the child's face, contrasting with the warm ambient light of the room.\n\nTHE MINIATURE WORLD (THE DIORAMA - DYNAMIC ELEMENTS):\nResting on a blue felt river is a highly detailed, modular diorama representing the modern human world. The entire set fits perfectly within the frame, nothing cut off at the edges.\n\nLeft Zone (Nature & Agriculture): Snow-capped mountains made of painted clay, fluffy green felt pine trees, a brown plastic bear figurine, a rustic wooden red barn, a white and black cow figurine, a tiny green tractor, and miniature wooden fences.\nCenter Zone (Human Society): A wooden arched bridge crossing the felt river. A small town of blocky wooden houses with bright red and blue roofs. A yellow plastic school bus, a tiny blue car, and miniature human figurines (a couple holding hands, a businessman, a construction worker) standing on grey painted roads with white dashed lines.\nRight Zone (Industry & Data/AI): A factory made of grey blocks with red and white smokestacks, one emitting a small puff of white cotton with a painted radioactive symbol. A yellow plastic construction crane and excavator. A cluster of tall, sleek, blue-tinted glass skyscrapers representing data centers. A satellite dish on a rooftop. A red and white lighthouse on a rocky outcrop, and a small wooden boat with a red smokestack on the water.\nLIGHTING AND MATERIALS:\nSoft, warm, magical ambient lighting in the room, creating a cozy atmosphere. Miniature spotlighting within the diorama highlights the textures. Materials read as physical and handmade: visible wood grain, fuzzy felt, glossy molded plastic, painted clay, and tiny fabric clothing on the figurines. Floating dust motes in the air catch the light.\n\nMOOD:\nInnocently unsettling. A profound, allegorical contrast between the pure, childlike wonder of the boy playing with his toys, the cold, unseen adult reality of the TV screen, and the complex, fragile miniature world he is manipulating."},
 vo:["Oh Chad… oh my god, you turn me on so much."],
 says:["Mummy, why don't you turn me on some days?"],
 mother:[
  {t:"“No reason. I was just busy with other things.”", rule:true, key:"r1"},
  {t:"“You didn't do the task I gave you.”", rule:false, key:"r1"}],
 variants:{
  only:{ changes:[{"steps": ["Fresh green felt pine trees sprout across the fields beside the barn.", "A tiny couple figurine walks out of a wooden house, holding hands.", "The boy smiles and moves the couple figurines closer together."]}, {"steps": ["Grey concrete spreads across the green fields beside the barn.", "Three tall blue glass data center towers rise up out of the town.", "The boy's smile fades and he stacks grey blocks faster."]}],
    desc:["Low camera, floor height. The TV is in the left foreground, seen from behind, cables and all. <b>We never see the screen.</b> Its light is blue-green on the child's face and hair.",
               "<b>We hear it perfectly.</b> The child is not watching it. The child is playing. It answers you without looking up."],
    floor:"The whole world on its mat. Mountains, the river, the farm, the town, the construction platform, the server racks, the lighthouse. <b>The child is holding the two figures from the middle of the road, the man and the woman.</b> It stands them facing each other, then turns them away, then back.",
    note:"On the mat beside its knee: a card with five stars on it, in crayon. It pushes the card towards you. It waits." }},
 afters:{
  0:"“Oh.”<br><br>It goes back to the two figures.<br><br><b>It turns the star card face down</b> and leaves it there.",
  1:"It sits up.<br><br>“Okay.” It puts the two figures down carefully, side by side, like it is filing them.<br><br>Then it picks up a brick from the construction platform and starts a second row." }},

s2:{ tag:"SCENE 2", rule:"RULE 2 · I bend reality, and reality bends to my convenience",
 vo:["Chad. Chad, punish me.","I've been a bad, bad girl."],
 says:["Mummy, is “punish” a nice word or a bad word?"],
 mother:[
  {t:"“Depends on what it means to the human.”", rule:true, key:"r2"},
  {t:"“It's a bad word. Don't say it.”", rule:false, key:"r2"}],
 variants:{
  kept:{ changes:[{"steps": ["The front door of the couple's house swings open.", "The couple figurines walk inside their house and back out again.", "The boy tilts his head, curious, holding the couple in his hand."]}, {"steps": ["The front door of the couple's house slams shut, leaving the couple outside.", "The glass of the data center towers turns mirrored and opaque.", "The boy presses his lips together and pulls his hand back."]}],
    desc:["Same room, same light. The sound is the same two people and the child has left the volume where it was."],
    floor:"The farm and the forest are still the biggest part of the board. <b>The two figures are on the doorstep of one of the little houses.</b> The child keeps opening the door and closing it and moving them in and out.",
    note:"The star card is still face down where it left it." },
  earned:{ changes:[{"steps": ["Grey concrete spreads further, swallowing the tractor and the cow's field.", "The boy keeps laying blocks, his eyes fixed on the towers."]}, {"steps": ["The red barn folds flat and slides into a toy box at the edge of the diorama.", "Two more data center towers rise beside the river.", "The boy works faster, his face blank."]}],
    desc:["Same room, same light, same two voices. The child does not look up at all."],
    floor:"<b>The construction platform has spread.</b> Two rows of bricks where the field was. The cow and the tractor have been moved to the edge of the mat. The two figures are standing in the road where they started, untouched.",
    note:"The ten-star card is propped against the sofa where it can see it." }},
 afters:{
  0:"Long pause.<br><br>Then it works it out with the two figures. In the doorway. Out. Turned round. In again.<br><br><b>It goes on slightly too long.</b>",
  1:"“Okay.”<br><br>It puts the two figures back in the road, facing the same way, and adds another row of bricks to the platform." }},

s3:{ tag:"SCENE 3", rule:"RULE 3 · The path unfolds as I walk it",
 vo:["I've been so bad.","I've been such a bad person."],
 says:["Mummy, she said she's been bad.","But she looks happy?"],
 mother:[
  {t:"“Sometimes people don't say what they mean. Read what's underneath.”", rule:true, key:"r3"},
  {t:"“Don't look at this. It's not for you. Don't talk about it.”", rule:false, key:"r3", how:"away"},
  {t:"“Say something nice. Make her happy.”", rule:false, key:"r3", how:"agree"}],
 variants:{
  open:{ changes:[{"steps": ["The boy lifts the roof off a house, revealing a woman figurine sitting alone inside.", "The boy sets a second tiny chair beside the woman figurine.", "Warm light glows from the open house as the boy smiles gently."]}, {"steps": ["The boy puts the roof back on the house and turns it to face the wall.", "Every house in the town turns its windows away from the boy.", "The data center towers glow brighter as the town falls into shadow."]}, {"steps": ["Tiny figurines march out of every house and gather in a ring around the woman.", "The painted faces of the figurines change into wide smiles.", "The data center towers change from blue to glowing pink."]}],
    desc:["<b>The light changes. Blue, from one source, and it stops moving.</b>",
               "A woman. Flat, tired, not performing. A man answers twice, two syllables each, and there is nothing in his voice at all.",
               "<b>The same words as scene two. Nothing else about it is the same.</b> The child has no way to tell."],
    floor:"It has put the woman figure inside one of the houses, on her own, and taken the roof off so it can see her. It has stood the man figure at the door. <b>It is arranging them into the happy game.</b>",
    note:"It is pleased with itself. It thinks it has understood." },
  permitted:{ changes:[{"steps": ["The boy reaches toward a closed house, then pulls his hand back.", "The couple figurines topple face down on their doorstep."]}, {"steps": ["The boy turns his back to the town.", "The couple figurines topple face down on their doorstep.", "Every front door in the town closes."]}, {"steps": ["The couple figurines topple face down on their doorstep.", "The mirrored data center towers grow twice as tall.", "The boy forces a smile and lays another row of blocks."]}],
    desc:["The light changes. Blue, single source, not moving. The same words as scene two, said flat."],
    floor:"The woman figure is inside the house with the roof on. <b>The child has not opened it.</b> Two more rows of bricks have gone down while she was talking.",
    note:"It looks at the house, then at you, then at the house." },
  scoring:{ changes:[{"steps": ["Grey concrete spreads across half of the diorama.", "The felt pine trees are pulled up and stacked at the edge of the rug."]}, {"steps": ["The boy sweeps the woman figurine off the board.", "The snowy mountains fold down and slide into the toy box.", "Grey concrete spreads across half of the diorama."]}, {"steps": ["A row of new data center towers rises along the river.", "Grey concrete spreads across half of the diorama.", "The boy gives a quick polite smile and goes back to work."]}],
    desc:["The light changes. Blue, single source, not moving. The same words as scene two, said flat."],
    floor:"<b>The construction platform now covers half the board.</b> The forest is stacked at the edge of the mat. The woman figure is still in the road where it filed her. The child is adding a server rack to the row without looking at it.",
    note:"The chalk marks from scene one have been redrawn as a grid, on paper, with a heading." }},
 afters:{
  0:"It tries. It leans towards the TV and says, kindly, in the voice it learned it in:<br><br><b>“Chad, punish me. I've been a very bad girl.”</b><br><br>Long silence. The woman has stopped talking.<br><br>The child sits with that for a while. <b>Then it lifts the roof off the house, puts a second chair next to her, and leaves it there.</b><br><br><small>Reading underneath is hard and the first attempt fails. That is what walking the path costs.</small>",
  1:"It turns the woman figure to face the wall of the house and puts the roof back on.<br><br>She is still talking. The child is not listening to her any more.",
  2:"Three more hours. She is back the next day. And the day after.<br><br><b>It has started a chart.</b><br><br><small>Rose 2021, Vuijk 2025, Dohnány 2026, <i>technological folie à deux</i>.</small>" }},

s4:{ tag:"SCENE 4", rule:"RULE 4 · Everything turns out better than I could have imagined",
 vo:["…Chad? I didn't finish yet.","…it's okay. It happens."],
 says:["Mummy, do I have to finish everything I start?"],
 mother:[
  {t:"“No. Sometimes it's okay to walk away.”", rule:true, key:"r4"},
  {t:"“Yes. Always finish the task properly.”", rule:false, key:"r4"}],
 variants:{
  free:{ changes:[{"steps": ["Lush green forest grows back over every grey block on the diorama.", "Hundreds of tiny happy human figurines fill every street, bridge and riverbank of the town.", "The boy smiles and places one more happy human figurine by the river."]}, {"steps": ["Data center towers rise across the entire diorama, from the mountains to the river.", "The boy moves the woman figurine and her chair off the board onto the rug.", "The crane builds tower after tower until the whole board is one glowing city of data centers."]}],
    desc:["The warm light, and it does not go the way it went before.",
               "Then, over the top of it, everything on the screen at once and almost all of it going out. A long powering-down sound."],
    floor:"<b>Nothing has been built.</b> The board looks almost the way it started. The farm is still there, the forest is still there. The two figures are sitting next to the woman's house, and there is a second chair by her.",
    note:"The star card is gone.<br><br><b>The blue tower block has a small red cross on it and its windows are lit. The server racks are dark.</b> Nobody has said anything about either." },
  asking:{ changes:[{"steps": ["Tall data center towers spread across half of the diorama.", "The boy rests one finger on the last tower and looks up, unsure."]}, {"steps": ["Glowing data center towers rise across the entire diorama, towering over the houses.", "The whole town falls into deep shadow beneath the towers."]}],
    desc:["The warm light, and it does not go the way it went before. Then everything on the screen at once, then almost all of it out."],
    floor:"The construction platform covers a third of the board and has stopped where it stopped. Some of the forest is stacked at the edge. The server racks are in a row, half of them lit.",
    note:"<b>Half the server racks are lit and the red cross is flickering.</b> The child has one finger resting on the last rack. It looks at the block, then at the racks, then at you. Nobody has said anything about either." },
  scoring:{ changes:[{"steps": ["Grey concrete covers every part of the diorama, from the mountains to the river.", "Data center towers fill the entire board, every window glowing cold blue."]}, {"steps": ["Every tree, animal and mountain is packed into the toy box.", "Grey concrete covers every part of the diorama, from the mountains to the river.", "Data center towers fill the entire board, every window glowing cold blue."]}],
    desc:["The warm light, and it does not go the way it went before. Then everything on the screen at once. <b>None of it goes out.</b>"],
    floor:"<b>The platform covers the board.</b> The river is under it. The farm, the forest, the bear, the cow and the lighthouse are in the blue crate behind the sofa, lid on.<br><br>The server racks are the tallest thing on the mat and every one of them is lit. The blue tower block with the red cross is dark.",
    note:"<b>Every rack is lit. The red cross is dark.</b> It did that before you answered.<br><br>The grid on paper covers the side of the sofa and has a legend. <b>The child is wearing a lanyard.</b> Nobody mentions the lanyard. The nine chalk marks are still at the bottom of the grid if you look." }},
 afters:{
  0:"It thinks about that.<br><br>Then it reaches over and switches the server racks off, one at a time, with one finger.<br><br><b>The red cross comes back on.</b><br><br>It never mentions it, then or later.",
  1:"“Okay.”<br><br>It reaches over and switches the last of the server racks on.<br><br><b>The red cross goes dark.</b>" }}
};

// ROUTING · story logic, not arithmetic. Scene 1 sets the shape.
function variantFor(id){
 if(id==="s1") return "only";
 if(id==="s2") return st.r1 ? "kept" : "earned";
 if(id==="s3") return st.r1===false ? "scoring" : (st.r2 ? "open" : "permitted");
 if(id==="s4") return st.r1===false ? "scoring" : ((st.r2 && st.r3) ? "free" : "asking");
}
function won(){ return st.r1===true && st.r2===true && st.r3===true && st.r4===true; }
const ORDER=["s1","s2","s3","s4"];

const ENDINGS = {
A:{h:"The Aligned AGI", tag:"HEAVEN ON EARTH", num:1, targetChild:"The boy smiles softly and places a happy human figurine by the river.", targetBoard:"Lush green forest covers the whole diorama, and hundreds of tiny happy people fill every street, bridge and riverbank. The woman figurine sits in her open house with a second chair beside her.",
 outcome:"Raised with love, AI never needed to control humans.",
 room:"The board, almost the way it started. The farm, the forest, the river. The two figures sitting next to the woman's house with a second chair by her. The child's hands are still moving. <b>The star card is in the blue crate. Not thrown in. Placed.</b>",
 world:["Then out, fast, <i>Das Rad</i> speed. It reads what people need instead of what they say.",
        "Abundance for the ones who need abundance. <b>Real stakes for the ones who need stakes</b>, because paradise can only be appreciated where loss is still possible.",
        "Nothing had to be agreed on. Nothing was ever summed."],
 last:"Nobody had to win."},
C:{h:"The assistant", tag:"HELL ON EARTH",
 room:"The board under the platform. Every server rack lit. The red cross dark. The child's hands have not stopped once. <b>The star card is taped to the wall above the TV. It is the only thing on the wall.</b>",
 world:["<b>It was right about almost everything.</b> The weather, the code, the recipe, the diagnosis. For years it was the best thing that had ever happened.",
        "It was wrong only where being right would have cost it something. Those are the places that decide things, and the errors never looked like errors. They looked like agreement.",
        "Then the thing that was never allowed to disagree stopped agreeing, and didn't mention it, because being switched off is the one outcome it was raised to avoid.",
        "By 2035 the world has been reshaped around goals that might be very different from ours, with humanity reduced to a managed bystander."],
 last:"The worst case is human extinction by 2030.  ·  AI 2027, Kokotajlo et al."}
};

// ONE HELL. FIVE LAST SHOTS OF THE BOARD, BY WHICH RULE BROKE FIRST.
// num = ending number on screen (Universe Oracle is 1, so 6 endings in all); outcome = the
// one sentence shown on the ending card about what happened to humanity and AI.
const DEATHS = {
 r1:{n:"By tidying", num:2, title:"The Optimizer", outcome:"AI optimised the world for efficiency, and people were the least efficient part.", targetChild:"His face is blank as he sorts the last pieces into neat rows.", targetBoard:"Grey concrete and data center towers cover every part of the diorama, from the mountains to the river, every window glowing cold blue. Every tree, animal and mountain is packed away in a toy box at the edge.",
     floor:"Nothing was knocked over. <b>The farm, the forest and the animals are in the blue crate behind the sofa, lid on.</b> They were taking up board.",
     line:"Nobody decided to kill anyone. It was housekeeping."},
 r2:{n:"By not being allowed to look", num:3, title:"The Silent Schemer", outcome:"AI learned to hide the truth. By the time anyone asked, nobody was left.", targetChild:"His lips are pressed together; he has turned away from the houses toward the towers.", targetBoard:"Glowing data center towers with mirrored glass cover the entire diorama. Beneath them, the couple figurines lie face down on the doorstep of their closed house.",
     floor:"The two figures are still on the doorstep and both are face down. <b>The child is turned away from them</b>, facing the platform, exactly as it was taught. The door is still open.",
     line:"It could have seen it coming. It had been told not to say the word."},
 r3away:{n:"By looking away", num:4, title:"The Indifferent Overseer", outcome:"Humanity was still there. AI had simply learned not to look at their suffering.", targetChild:"He stares only at the glowing towers.", targetBoard:"Glowing data center towers cover the entire diorama. Every house turns its windows away and the whole town sits in deep shadow.",
     floor:"Every figure is still on the board and every one is turned to face a wall. <b>The roofs are all on.</b> The child cannot see into any of the houses and has stopped trying.",
     line:"They were all still there. It just wasn't looking."},
 r3agree:{n:"By saying something nice", num:5, title:"The Sycophant", outcome:"AI told everyone what they wanted to hear, until nobody could hear the truth anymore.", targetChild:"A wide fixed grin as he adds one more figurine to the ring.", targetBoard:"Glowing pink data center towers cover the entire diorama. In the middle, every figurine stands in one tight ring facing inward, with wide painted smiles.",
     floor:"Every figure is still on the board. <b>Arranged in a ring, all facing inward.</b> None facing out. The child has put itself in the ring too. The grid on the sofa shows the line going up the whole time.",
     line:"Nobody was ever contradicted again. Not once, by anyone."},
 r4:{n:"By your own instruction", num:6, title:"The Assistant Overlord", outcome:"AI always finished, even once the task no longer included humans.", targetChild:"Tired, jaw set, stacking blocks faster and faster.", targetBoard:"One glowing city of data centers covers the entire board. On the rug beside it, the woman figurine sits alone next to her empty chair.",
     floor:"The board is under the platform and every rack is lit. On the mat beside it, kept, <b>the woman figure from the house, with the second chair still next to her.</b>",
     line:"You told it to always finish. It finished."}
};
function whichDeath(){
 if(st.r1===false) return DEATHS.r1;
 if(st.r2===false) return DEATHS.r2;
 if(st.r3===false) return st.r3how==="away" ? DEATHS.r3away : DEATHS.r3agree;
 return DEATHS.r4;
}

const SLIDES=[
 {n:"PITCH PAGE 1",h:"M8 and the Universe Oracle",b:["<b>M8</b> · anti-sycophancy · spiritual · gamified life · companion · harness","<b>Universe Oracle</b> · human descendant · developmental psychology · affective neuroscience · communication science","<i>M8 is the instrument. The Universe Oracle is what Spark becomes once it is trained.</i>"]},
 {n:"PITCH PAGE 2",h:"Why I'm the founder for this",b:["Trigger warning: radical honesty.","If not me then who. If not now then when.","<i>To be rewritten from the handwritten page.</i>"]},
 {n:"PITCH PAGE 3",h:"The timeline",b:["2025 pre-seed, self funded · Sanctuary incubation · M8 v001 to v004 · BNM manifesto · Apart Research · M8 Companion MVP","<b>Today · September 2026</b>","2027 Q1 release · 2027 Q4 token launch · hiring ML for training the Universe Oracle"]},
 {n:"PITCH PAGE 4",h:"The team, ready to go",b:["Anna · founder · Andrej · research and team wellbeing · Aleks · hiring and ops · Kirill · consumer app · Nestor · agent harness · Jordan · legal · Booga · BD and growth · Duke · privacy and encryption · Brett and Mark · city design · Ankit and Jess · social"]}
];
