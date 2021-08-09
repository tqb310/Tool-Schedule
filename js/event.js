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
        // console.log(workBook)
        let workSheets = {};
        workBook.SheetNames.forEach(sheetName => {
            workSheets[sheetName] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName])
        });        
        let json = JSON.stringify({ 'TKB': convertToSubject(workSheets, 'TKB LT').concat(convertToSubject(workSheets, 'TKB TH')) });
        localStorage.setItem('fileData', json);
        localStorage.setItem('fileName', file.name);
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
        alert.classList.add('d-block');        
        alert.innerHTML = `<span>Bạn chưa tải file lên</span>`
        return;
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
    renderTimeTable(subjectList);
    //Alert error message
    if (errorClassCode.length) {
        alert.classList.remove('d-none');
        alert.classList.add('d-block');
        // console.log(alert.children[]);
        alert.innerHTML = `<span class='lead'>Mã lớp không tồn tại: 
                                <span class='font-weight-bold'>${errorClassCode.join(',')}</span>
                            </span>`
    } else {
        alert.classList.remove('d-block');
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