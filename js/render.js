import time from './constants.js'
const subjectContent = document.getElementById('subjectContent');


//--------------------------------------------------------------------------------//
//FUNCTION 2: Render time table
function renderTimeTable(data, handledCellOnRow) {
    //Get cells on every row after handling
    //handledCellOnRow = computeCellOnRow(data);

    //Insert first row
    handledCellOnRow.unshift(['2', '3', '4', '5', '6', '7']);

    //Initilize time table content
    let htmlContent = '';

    for (let i = 0; i < 10; i++) {
        const td = handledCellOnRow[i].map(item => {
            const subject = data.find(sj => item.indexOf(sj.weekDay) !== -1 && sj.period[0] == i + 1)
            if (subject)
                return `
                    <td class=bg-white rowspan=${subject.period.length}>
                        <h5>${subject.classCode || ''}</h5>
                        <p class="lead">${subject.subjectName || ''}</p>
                        <h5>${subject.teacherName || ''}</h5>
                        <p class="lead">${subject.classRoom || ''}</p>
                        <p class="lead">${subject.startDate ? 'BĐ: ' + subject.startDate : ''}</p>
                        <p class="lead">${subject.endDate ? 'KT: ' + subject.endDate : ''}</p>
                    </td>   
                `
            return '<td></td>'
        }).join('');

        htmlContent += `
            <tr>
                <td>
                    <span class="d-block">Tiết ${i + 1}</span>
                    (${time[i]})
                </td>        
                ${td}    
            </tr>
            `
    }
    data.forEach(subject => {
        if ('ĐAHT2'.indexOf(subject.practiceType) !== -1)
            htmlContent += `
                <tr>
                    <td class=bg-white colspan='7'>
                        <h5>${subject.classCode || ''}</h5>
                        <p class="lead">${subject.subjectName || ''}</p>
                        <h5>${subject.teacherName || ''}</h5>                        
                        <p class="lead">${subject.startDate ? 'BĐ: ' + subject.startDate : ''}</p>
                        <p class="lead">${subject.endDate ? 'KT: ' + subject.endDate : ''}</p>
                    </td>
                </tr>
            `
    })
    subjectContent.innerHTML = htmlContent;
}

//renderTimeTable(data);
//--------------------------------------------------------------------------------//
export default renderTimeTable;
