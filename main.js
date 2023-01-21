const request = require('request');
const readline = require('readline');
const path = require('path');
const {canvas, createCanvas, loadImage, registerFont} = require("canvas");
const fs = require("fs");
const School = require('school-kr');
const school = new School();
const { formatTitle } = require("./utils/format-title");
registerFont('font/나눔바른고딕/NanumBarunGothicBold.ttf', { family: '나눔바른고딕'})
registerFont('font/나눔바른고딕/NanumBarunGothic.ttf', { family: 'NanumBarunGothic'})

var RL = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});
RL.setPrompt('Chat > ');
RL.prompt();
RL.on('line', function(chat) {
	const sleep = (ms) => {
		return new Promise(resolve=>{
			setTimeout(resolve,ms)
		})
	}
	const sm = async(학교이름) => {
		for(i=0; i<학교이름.length; i++) {
			Sfm(학교이름[i]);
			await sleep(1500);
			fs.readFile("SFM/SFM.txt", {encoding:'UTF8'}, function(err, data) {
				if (data.includes('&') == true) {
					var result = data.replaceAll('&amp;','&');
				} else {
					var result = data;
				}
				CCSM(학교이름[i]+' 급식', String(result), 학교이름[i]);
			})
			await sleep(1500);
		}
		console.log("[ FINISH ]");
	}
    async function Sfm(학교이름) {
        var result = await school.search(School.Region.SEOUL, 학교이름);
        var sN = result[0].name;
        var sC = result[0].schoolCode;
        var sA = result[0].address;
        school.init(School.Type.HIGH, School.Region.SEOUL, sC);
        const meal = await school.getMeal();
        const calendar = await school.getCalendar();
        var sct = calendar.today;
        var smf = meal.today;
        if(smf.length == 0) {
            smf = ("[ 오늘 급식 정보가 없습니다. ]")
        }
        if(sct.length == 0) {
            sct = ("[ 오늘은 일정이 없습니다. ]")
        }
        var Vresult = '학교이름 : '+sN+'\n\n'+'학교일정 : '+sct;
        fs.writeFileSync('SFM/SFM.txt', Vresult+'\n\n'+smf);
    }
    function CCSM(Title, Author, ImageName) {

        const post = {
            title: Title,
            author: Author,
          };
          
          const width = 3600;
          const height = 3600;
          const titleY = 1800;
          const lineHeight = 950;
          const authorY = 1800;
          
          const canvas = createCanvas(width, height);
          const context = canvas.getContext("2d");
          
          context.fillStyle = "#764abc";
          context.fillRect(0, 0, width, height);
          
          context.font = "bold 210pt '나눔바른고딕'";
          context.textAlign = "center";
          context.fillStyle = "#fff";
          
          const text = formatTitle(post.title);
          context.fillText(text[0], 1800, titleY - lineHeight);
          
          context.font = "80pt 'NanumBarunGothic'";
          context.fillText(`${post.author}`, 1800, authorY - 600);
          
          const buffer = canvas.toBuffer("image/png");
          fs.writeFileSync("Image/"+ImageName+".png", buffer);
    }    
	if (chat == 'exit') {
		RL.close();
	}
	if (chat.startsWith('.급식 ')) {
		const 학교이름 = chat.substring(4).split(" ");
		sm(학교이름);
	}
	RL.prompt()
});
RL.on('close', function() {
	process.exit();
});