// Import stylesheets
import './style.css';

//interfaces for the band data
interface BandMember {
  name: string;
  age: number;
  plays: string[];
}

interface BandMembers {
  current: BandMember[];
  past: BandMember[];
}

interface Plays {
  vocals: string[];
  synth: string[];
  guitar: string[];
  bass: string[];
  drums: string[];
}

interface Band {
  members: BandMembers;
  all?: Array<string>;
  plays?: Object;
}

//constants
const title: string = 'Typescript Task';
const creator: string = 'Aide Barniskyte';

//original data
const band: Band = {
  members: {
    current: [
      { name: 'Sascha', age: 59, plays: ['vocals', 'synth', 'guitar', 'bass'] },
      { name: 'Lucia', age: 49, plays: ['vocals', 'synth'] },
      { name: 'Jules', age: 53, plays: ['guitar', 'bass', 'synth'] },
      { name: 'Steve', age: 55, plays: ['guitar'] },
    ],
    past: [
      { name: 'Raymond', age: 57, plays: ['vocals', 'synth'] },
      { name: 'En', age: 52, plays: ['vocals', 'drums', 'guitar', 'synth'] },
      { name: 'Gunter', age: 57, plays: ['guitar', 'synth'] },
    ],
  },
};

//modified data
var expected: Band = { members: band.members };

//functions for data modification

//function for appending a BandMember to BandMember[]
function appendBandMemberArray(
  array: BandMember[],
  member: BandMember
): BandMember[] {
  return [...array, member];
}

//function for joining two BandMember arrays to one.
function joinBandMemberArrays(
  array1: BandMember[],
  array2: BandMember[]
): BandMember[] {
  return [...array1, ...array2];
}

//function for sorting BandMember[] by age (in descending order) and then name (in ascending order)
function sortBandMemberArray(members: BandMember[]): BandMember[] {
  return members.sort((a, b) => {
    // Sort by age in descending order
    if (a.age > b.age) {
      return -1;
    } else if (a.age < b.age) {
      return 1;
    } else {
      // If ages are equal, sort by name in ascending order
      return a.name.localeCompare(b.name);
    }
  });
}

//function for extracting unique plays from BandMember[]
function uniquePlays(members: BandMember[]): string[] {
  var uniquePlays: string[] = [];

  members.forEach((member) => {
    member.plays.forEach((play) => {
      if (!uniquePlays.includes(play)) {
        uniquePlays.push(play);
      }
    });
  });

  return uniquePlays;
}

//function for creating string arrays of names of members who play a specific instrument
function namesByInstrument(
  instrument: string,
  members: BandMember[]
): string[] {
  var result = [];
  members.forEach((member) => {
    if (member.plays.includes(instrument)) {
      result.push(member.name);
    }
  });
  return result;
}

//function for creating an array of arrays of members who play a specific instrument
function arraysOfNamesByInstrument(
  plays: string[],
  members: BandMember[]
): Array<string[]> {
  var result: Array<string[]> = [];
  plays.forEach((play) => {
    result.push(namesByInstrument(play, members));
  });
  return result;
}

//data modifications: adding 'all'

//forming 'allmembers'
var allmembers: BandMember[] = expected.members.current;
allmembers = joinBandMemberArrays(allmembers, expected.members.past);

//sorting 'allmembers' by age and name
allmembers = sortBandMemberArray(allmembers);

//mapping to string[] of names, lowercasing the names and adding to 'expected'
var allnames = allmembers.map((member) => member.name);
var allnamesLowercase: string[] = allnames.map((name) => name.toLowerCase());
expected.all = allnamesLowercase;
/////

//creating an array of each instrument played by at least one member in the band
var plays: string[] = uniquePlays(allmembers);

//creating arrays of names of those who play a certain instrument
var arrayOfNames: string[][] = arraysOfNamesByInstrument(plays, allmembers);

//lowercasing the arrayOfNames
var arrayOfNamesLowercase: string[][] = arrayOfNames.map(innerArray =>
  innerArray.map(name => name.toLowerCase())
);

//creating the 'plays' prop
var playsResult: { [key: string]: string[] } = plays.reduce((result, key, index) => {
  result[key] = arrayOfNamesLowercase[index];
  return result;
}, {});

expected.plays = playsResult


//a function for displaying band data in a human-readable format (for displaying in HTML)
function bandToString(band: Band): string {
  var extended: boolean = false;
  const currentMembersString = band.members.current
    .map(formatMemberToString)
    .join('\n');

  const pastMembersString = band.members.past
    .map(formatMemberToString)
    .join('\n');

    var allString: string = ""
    var playsString: string = ""

    if(band.all) {
      extended = true;
      allString = band.all.join('\n')
    }
    if(band.plays) {
      playsString = formatPlaysToString(band.plays)
    }

  if (!extended) return `Current Members:\n${currentMembersString}\n\nPast Members:\n${pastMembersString}`;
  else return `Current Members:\n${currentMembersString}\n\nPast Members:\n${pastMembersString}\n\nAll members:\n${allString}\n\nPlays:\n${playsString}`;
}

//Helper function: formats the member string for bandToString
function formatMemberToString(member: BandMember): string {
  return `Name: ${member.name}, Age: ${member.age}, Plays: ${member.plays.join(', ')}`;
}

//Helper function: formats the 'plays' for bandToString
function formatPlaysToString(plays: any): string {
  let result = '';

  for (const instrument in plays) {
    if (plays.hasOwnProperty(instrument)) {
      const players = plays[instrument].join(', ');
      result += `${instrument.charAt(0).toUpperCase() + instrument.slice(1)}: ${players}\n`;
    }
  }

  return result.trim();
}

//print the data to console
console.log('Original data');
console.log(band);
console.log('Modified data:');
console.log(expected);

//display the HTML page
const appDiv: HTMLElement = document.getElementById('app');

const heading1: HTMLElement = document.querySelector(
  'h1'
) as HTMLHeadingElement;
heading1.innerText = title;

const heading2: HTMLElement = document.querySelector(
  'h2'
) as HTMLHeadingElement;
heading2.innerText = 'Created by: ' + creator;

const paragraph1Title: HTMLElement = document.getElementById('paragraph1Title');
paragraph1Title.innerText = 'Original data:';

const paragraph1: HTMLElement = document.getElementById('paragraph1');
paragraph1.innerText = bandToString(band);
//paragraph1.setAttribute("style", "color:red; border: 1px solid blue;");

const paragraph2Title: HTMLElement = document.getElementById('paragraph2Title');
paragraph2Title.innerText = 'Modified data:';

const paragraph2: HTMLElement = document.getElementById('paragraph2');
paragraph2.innerText = bandToString(expected)

/*appDiv.appendChild(heading1)
appDiv.appendChild(heading2)
appDiv.appendChild(paragraph1Title)
appDiv.appendChild(paragraph1)*/
