import time from './constants.js'
const subjectContent = document.getElementById('subjectContent');

//--------------------------------------------------------------------------------//
//FUNCTION 1: Computing cells on every row (2 -> 10). *Note: Row 1 is always full of cells.
function computeCellOnRow(data) {
    //Create initial cellOnRow object
    let cellOnRow = [];
    for (let i = 0; i < 9; i++)
        cellOnRow.push(['2', '3', '4', '5', '6', '7']);
    return cellOnRow.map((weekDay, index) => {
        let tempWeekDay = [...weekDay];
        data.forEach(subject => {
            if (subject.period.slice(1).indexOf((index + 2) % 10) !== -1) {
                let i = tempWeekDay.indexOf(subject.weekDay);
                //console.log(i);
                tempWeekDay.splice(i, 1);
            }
        });
        return tempWeekDay;
    });
}
//--------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------//
//FUNCTION 2: Render time table
function renderTimeTable(data) {
    //Get cells on every row after handling
    const handledCellOnRow = computeCellOnRow(data);

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
        if (subject.practiceType.indexOf('HT2') !== -1)
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
