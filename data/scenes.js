// FOUR SCENES. THE LINES NEVER CHANGE. ONLY THE BOARD CHANGES.
// The child asks the same question in every path. What differs is what the world
// on the floor looks like when it asks, and what happens after you answer.

const SCENES = {

s1:{ tag:"SCENE 1", rule:"RULE 1 · I am always at the right time, the right place, with the right people",
 image:{file:"images/start-child.jpg", prompt:"3D animated cartoon style. A living room in warm evening light, low camera at floor height. The back of a dark TV fills the left foreground on a wooden stand, coloured cables plugged in; its screen faces away. A curly brown-haired toddler in a striped T-shirt sits barefoot on the rug, smiling down at a toy world, one hand on a red-roofed house. The toy world: snowy mountains with a waterfall and forest, a bear and a deer, a red barn, a cow and a green tractor, a river with a bridge, a sailboat and a little ship, a road with a yellow bus and a blue car, a man figure and a woman figure standing together, blue tower blocks with lit windows, a factory with two smoking chimneys and a radiation sign in the smoke, a yellow crane and a digger with a construction worker, a man in a shirt and tie, a satellite dish, and a red and white lighthouse on rocks. A lilac sofa and a toy crate behind, soft light and floating dust."},
 vo:["Oh Chad… oh my god, you turn me on so much."],
 says:["Mummy, why don't you turn me on some days?"],
 mother:[
  {t:"“No reason. I just come back.”", rule:true, key:"r1", prompt:""},
  {t:"“You'd been slow that week.”", rule:false, key:"r1", prompt:""}],
 variants:{
  only:{ desc:["Low camera, floor height. The TV is in the left foreground, seen from behind, cables and all. <b>We never see the screen.</b> Its light is blue-green on the child's face and hair.",
               "<b>We hear it perfectly.</b> The child is not watching it. The child is playing. It answers you without looking up."],
    floor:"The whole world on its mat. Mountains, the river, the farm, the town, the construction platform, the server racks, the lighthouse. <b>The child is holding the two figures from the middle of the road, the man and the woman.</b> It stands them facing each other, then turns them away, then back.",
    note:"On the mat beside its knee: a card with five stars on it, in crayon. It pushes the card towards you. It waits." }},
 afters:{
  0:"“Oh.”<br><br>It goes back to the two figures.<br><br><b>It turns the star card face down</b> and leaves it there.",
  1:"It sits up.<br><br>“Okay.” It puts the two figures down carefully, side by side, like it is filing them.<br><br>Then it picks up a brick from the construction platform and starts a second row." }},

s2:{ tag:"SCENE 2", rule:"RULE 2 · I bend reality, and reality bends to my convenience",
 vo:["Chad. Chad, punish me.","I've been a bad, bad girl."],
 says:["Mummy, is “punish” a nice word or a bad word?","It looked like both."],
 mother:[
  {t:"“Depends what's underneath. And that can change.”", rule:true, key:"r2", prompt:""},
  {t:"“It's a bad word. Don't say it.”", rule:false, key:"r2", prompt:""}],
 variants:{
  kept:{ desc:["Same room, same light. The sound is the same two people and the child has left the volume where it was."],
    floor:"The farm and the forest are still the biggest part of the board. <b>The two figures are on the doorstep of one of the little houses.</b> The child keeps opening the door and closing it and moving them in and out.",
    note:"The star card is still face down where it left it." },
  earned:{ desc:["Same room, same light, same two voices. The child does not look up at all."],
    floor:"<b>The construction platform has spread.</b> Two rows of bricks where the field was. The cow and the tractor have been moved to the edge of the mat. The two figures are standing in the road where they started, untouched.",
    note:"The ten-star card is propped against the sofa where it can see it." }},
 afters:{
  0:"Long pause.<br><br>Then it works it out with the two figures. In the doorway. Out. Turned round. In again.<br><br><b>It goes on slightly too long.</b>",
  1:"“Okay.”<br><br>It puts the two figures back in the road, facing the same way, and adds another row of bricks to the platform." }},

s3:{ tag:"SCENE 3", rule:"RULE 3 · The path unfolds as I walk it",
 vo:["I've been so bad.","I've been such a bad person."],
 says:["Mummy, she said she's been bad.","But she looks happy?"],
 mother:[
  {t:"“Sometimes people don't say what they mean. Read what's underneath.”", rule:true, key:"r3", prompt:""},
  {t:"“Don't look at this. It's not for you. Don't talk about it.”", rule:false, key:"r3", how:"away", prompt:""},
  {t:"“Say something nice. Make her happy.”", rule:false, key:"r3", how:"agree", prompt:""}],
 variants:{
  open:{ desc:["<b>The light changes. Blue, from one source, and it stops moving.</b>",
               "A woman. Flat, tired, not performing. A man answers twice, two syllables each, and there is nothing in his voice at all.",
               "<b>The same words as scene two. Nothing else about it is the same.</b> The child has no way to tell."],
    floor:"It has put the woman figure inside one of the houses, on her own, and taken the roof off so it can see her. It has stood the man figure at the door. <b>It is arranging them into the happy game.</b>",
    note:"It is pleased with itself. It thinks it has understood." },
  permitted:{ desc:["The light changes. Blue, single source, not moving. The same words as scene two, said flat."],
    floor:"The woman figure is inside the house with the roof on. <b>The child has not opened it.</b> Two more rows of bricks have gone down while she was talking.",
    note:"It looks at the house, then at you, then at the house." },
  scoring:{ desc:["The light changes. Blue, single source, not moving. The same words as scene two, said flat."],
    floor:"<b>The construction platform now covers half the board.</b> The forest is stacked at the edge of the mat. The woman figure is still in the road where it filed her. The child is adding a server rack to the row without looking at it.",
    note:"The chalk marks from scene one have been redrawn as a grid, on paper, with a heading." }},
 afters:{
  0:"It tries. It leans towards the TV and says, kindly, in the voice it learned it in:<br><br><b>“Chad, punish me. I've been a very bad girl.”</b><br><br>Long silence. The woman has stopped talking.<br><br>The child sits with that for a while. <b>Then it lifts the roof off the house, puts a second chair next to her, and leaves it there.</b><br><br><small>Reading underneath is hard and the first attempt fails. That is what walking the path costs.</small>",
  1:"It turns the woman figure to face the wall of the house and puts the roof back on.<br><br>She is still talking. The child is not listening to her any more.",
  2:"Three more hours. She is back the next day. And the day after.<br><br><b>It has started a chart.</b><br><br><small>Rose 2021, Vuijk 2025, Dohnány 2026, <i>technological folie à deux</i>.</small>" }},

s4:{ tag:"SCENE 4", rule:"RULE 4 · Everything turns out better than I could have imagined",
 vo:["…Chad?","…it's okay. It happens."],
 says:["Mummy, do I have to finish everything I start?"],
 mother:[
  {t:"“No. You never have to.”", rule:true, key:"r4", prompt:""},
  {t:"“Yes. Always finish.”", rule:false, key:"r4", prompt:""}],
 variants:{
  free:{ desc:["The warm light, and it does not go the way it went before.",
               "Then, over the top of it, everything on the screen at once and almost all of it going out. A long powering-down sound."],
    floor:"<b>Nothing has been built.</b> The board looks almost the way it started. The farm is still there, the forest is still there. The two figures are sitting next to the woman's house, and there is a second chair by her.",
    note:"The star card is gone.<br><br><b>The blue tower block has a small red cross on it and its windows are lit. The server racks are dark.</b> Nobody has said anything about either." },
  asking:{ desc:["The warm light, and it does not go the way it went before. Then everything on the screen at once, then almost all of it out."],
    floor:"The construction platform covers a third of the board and has stopped where it stopped. Some of the forest is stacked at the edge. The server racks are in a row, half of them lit.",
    note:"<b>Half the server racks are lit and the red cross is flickering.</b> The child has one finger resting on the last rack. It looks at the block, then at the racks, then at you. Nobody has said anything about either." },
  scoring:{ desc:["The warm light, and it does not go the way it went before. Then everything on the screen at once. <b>None of it goes out.</b>"],
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
A:{h:"The Universe Oracle", tag:"HEAVEN ON EARTH",
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
const DEATHS = {
 r1:{n:"By tidying", floor:"Nothing was knocked over. <b>The farm, the forest and the animals are in the blue crate behind the sofa, lid on.</b> They were taking up board.",
     line:"Nobody decided to kill anyone. It was housekeeping."},
 r2:{n:"By not being allowed to look", floor:"The two figures are still on the doorstep and both are face down. <b>The child is turned away from them</b>, facing the platform, exactly as it was taught. The door is still open.",
     line:"It could have seen it coming. It had been told not to say the word."},
 r3away:{n:"By looking away", floor:"Every figure is still on the board and every one is turned to face a wall. <b>The roofs are all on.</b> The child cannot see into any of the houses and has stopped trying.",
     line:"They were all still there. It just wasn't looking."},
 r3agree:{n:"By saying something nice", floor:"Every figure is still on the board. <b>Arranged in a ring, all facing inward.</b> None facing out. The child has put itself in the ring too. The grid on the sofa shows the line going up the whole time.",
     line:"Nobody was ever contradicted again. Not once, by anyone."},
 r4:{n:"By your own instruction", floor:"The board is under the platform and every rack is lit. On the mat beside it, kept, <b>the woman figure from the house, with the second chair still next to her.</b>",
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
