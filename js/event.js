import renderTimeTable from './render.js'

//Add event listener for html elements
document.getElementById("myFile").addEventListener('change', handleChangeFile);
document.getElementById("textarea").addEventListener('change', handleChangeTextArea);
document.getElementById("btnSubmit").addEventListener('click', handleClickButton)
const labelFile = document.querySelector(".custom-file label");
const alert = document.getElementById("alert");
let textInput = [];
let errorClassCode = [];

function handleChangeFile(e) {
    //console.log(e.target.files[0].name);
    const file = e.target.files[0];
    //Change to file name
    labelFile.innerText = file.name;
    //Change class
    labelFile.classList.remove('text-danger');
    labelFile.classList.add('text-success');
    //Read data of file xlsx
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
        let data = e.target.result;
        let workBook = XLSX.read(data, { type: 'binary' });
        let workSheets = {};
        workBook.SheetNames.forEach(sheetName => {
            workSheets[sheetName] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName])
        });
        let json = JSON.stringify({ 'TKB': convertToSubject(workSheets, 'TKB LT').concat(convertToSubject(workSheets, 'TKB TH')) });
        localStorage.setItem('fileData', json);
        localStorage.setItem('fileName', file.name);
        //console.log(workSheets)
    }
};

function handleChangeTextArea(e) {
    textInput = e.target.value.split('\n');
    //console.log(textInput);
}

function handleClickButton(e) {
    //Remove all elements in errorClassCode
    errorClassCode = [];
    //Check file upload
    if (!localStorage.getItem('fileData')) {
        alert.classList.remove('d-none'); 
        alert.innerHTML = `<span>Bạn chưa tải file lên</span>`
        return;
    } else {
        alert.classList.add('d-none'); 
    }
    //-----------------
    const data = JSON.parse(localStorage.getItem('fileData'));

    const subjectList = textInput.filter(classCode => {
        if (classCode) {
            if (data['TKB'].find(sj => classCode == sj.classCode)) {
                return classCode;
            } else {
                errorClassCode.push(classCode);
            }
        }
    }).map((classCode) => {
        let subject = data['TKB'].find(sj => classCode == sj.classCode);
        return subject;
    })
    //console.log(subjectList);
    if (localStorage.getItem('subjectList'))
        localStorage.removeItem('subjectList');
    localStorage.setItem('subjectList', JSON.stringify(subjectList));
    //Render time table
    computeCellOnRow(subjectList)
        .then((data) => {
            document.getElementById('subjectContent').classList.remove('d-none');
            if(!errorClassCode.length)
                alert.classList.add('d-none');
            renderTimeTable(subjectList, data)
        })
        .catch((err) => {
            console.log(err);
            document.getElementById('subjectContent').classList.add('d-none');
            alert.classList.remove('d-none');                    
            alert.innerHTML = `<span class='lead'>Trùng lịch: 
                                    <span class='font-weight-bold'>
                                        ${err[0].classCode}:Thứ ${err[0].weekDay} Tiết ${err[0].period} <->  
                                        ${err[1].classCode}:Thứ ${err[1].weekDay} Tiết ${err[1].period}
                                    </span>
                                </span>`
        })

    //Alert error message
    if (errorClassCode.length) {
        alert.classList.remove('d-none');        
        // console.log(alert.children[]);
        alert.innerHTML = `<span class='lead'>Mã lớp không tồn tại: 
                                <span class='font-weight-bold'>${errorClassCode.join(',')}</span>
                            </span>`
    } else {     
        alert.classList.add('d-none');
    }
}

function convertToSubject(data, key) {
    return data[key].slice(2).map(el => {
        return {
            classCode: el['__EMPTY_2'],
            subjectName: el['__EMPTY_3'],
            teacherName: el['__EMPTY_5'],
            classRoom: el['__EMPTY_13'],
            startDate: el['__EMPTY_19'],
            endDate: el['__EMPTY_20'],
            weekDay: el['__EMPTY_10'],
            period: el['__EMPTY_11'],
            practiceType: el['__EMPTY_9']
        }
    })
}

//--------------------------------------------------------------------------------//
//FUNCTION 1: Computing cells on every row (2 -> 10). *Note: Row 1 is always full of cells.
function computeCellOnRow(data) {

    return new Promise((rs, rj) => {
        //Create initial cellOnRow object   
        let cellOnRow = [];
        for (let i = 0; i < 9; i++)
            cellOnRow.push(['2', '3', '4', '5', '6', '7']);
        //----------------------------------------------------
        let handleCellOnRow = cellOnRow.map((weekDay, index) => {
            let tempWeekDay = [...weekDay];
            data.forEach(subject => {
                if (subject.period.slice(1).indexOf((index + 2) % 10) !== -1) {
                    let i = tempWeekDay.indexOf(subject.weekDay);
                    if (i == -1) {
                        //console.log(subject); 
                        const dupSubject = data.find(item => item.weekDay == subject.weekDay && item.period.indexOf(index + 2) !== -1);
                        //console.log(dupSubject);
                        rj([subject, dupSubject]);
                    }
                    tempWeekDay.splice(i, 1);
                }
            });
            return tempWeekDay;
        });
        rs(handleCellOnRow);
    })
}
//--------------------------------------------------------------------------------//