function Calo(){
    let h = document.getElementById('hi').value;
    let w = document.getElementById('we').value;
    let age = document.getElementById('age').value;


    let calo = (10* w/1 + 6.25 * h/1 - 5 * age/1 + 5);
    let calom = calo * 1.4;

    document.getElementById("resultcal").innerHTML="Your Daily Calories intake: "+calom;

    const proteins = calom*0.12;
    const carbs =calom*0.60;
    const fats =calom*0.27;

    let data2 = ['proteins','fats','carbs'];
    const ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx,{
        type:'doughnut',
        data:{
            labels:['proteins','fats','carbs'],
            dataset:[
                {
                    label: '# of votes',
                    data:data2,
                    backgroundColor:['#2adece','#dd3b79','#ff766b'],
                    borderwidth:1
                }

            ]
        }
    });

}

function Clear(){

    document.getElementById('resultcal').innerHTML="";
}