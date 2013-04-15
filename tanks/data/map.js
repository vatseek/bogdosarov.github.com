function map () {
    var arr; // массив в котором будет храниться карта
    
    // Задаём массив
    this.setArr = function (a) {
        arr = a;
    }
   
    // Метод рисует карту на холсте
    this.draw = function (canvas, tileSet) {
        var ctx = canvas.getContext('2d');
        canvas.height = 13 * size;
        canvas.width  = 13 * size;
        ctx.globalAlpha = 1;
       
        // Цикл обрабатывающий массив в котором содержатся значения элементов карты
        // если попадается 1 то рисуется кирпичный блок
        // если 2, то бетонная стена	
        for (var j = 0; j < 26; j++) { 
            for (var i = 0; i < 26; i++) {
                switch (arr[j][i]) {
                    case 0:
                        ctx.drawImage(tileSet, 0, 0, size/2, size/2, i*size/2, j*size/2, size/2, size/2);
                        break;
                    case 1:
                        ctx.drawImage(tileSet, size/2, 0, size/2, size/2, i*size/2, j*size/2, size/2, size/2);
                        break;
                    case 2:
                        ctx.drawImage(tileSet, size, 0, size/2, size/2, i*size/2, j*size/2, size/2, size/2);
                        break;
                }
            }
        }
    }
}