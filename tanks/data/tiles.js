// Рисуем содержимое "тайлсета"
    function drawTiles (canvas) {
        var context = canvas.getContext('2d');
            context.globalAlpha = 1;
        
        // Пустая клетка
        var empty = function () {	
            context.fillStyle = '#000';
            context.fillRect(0, 0, size/2, size/2); 
        }
        
        // Кирпичная стена
        var brick = function () {
           
            // Отрисовка основного цвета кирпича
            context.fillStyle = "#ffff00";
            context.fillRect(0, 0, size/2, size/2); 
           
            // Отрисовка теней
            context.fillStyle = "#808080";
            context.fillRect(0, 0, size/2 , size/16);
            context.fillRect(0, 0+size/4 , size/2 , size/16);
            context.fillRect(size/4 , 0, size/16, size/4 ); 
            context.fillRect(size/16, size/4, size/16, size/4 ); 
           
            // Отрисовка раствора между кирпичами
            context.fillStyle = "#c0c0c0";
            context.fillRect(0, 3*size/16, size/2 , size/16);
            context.fillRect(0, 7*size/16, size/2 , size/16);
            context.fillRect(3*size/16, 0        , size/16, size/4 ); 
            context.fillRect(0, 3*size/16, size/16, size/4 );
        }
       
        // Бетонный блок
        var hbrick = function () {
         
            // Отрисовка основного фона
            context.fillStyle = "#c0c0c0";
            context.fillRect(0, 0, size/2, size/2); 
         
            // Отрисовка Тени
            context.fillStyle = "#808080";
            context.beginPath();
            context.moveTo(0, size/2);  
            context.lineTo(size/2, size/2);  
            context.lineTo(size/2, 0);  
            context.fill();  
           
            // Отрисовка белого прямоугольника сверху
            context.fillStyle = "#fff";
            context.fillRect(size/8, size/8, size/4, size/4);
        }
       
        // Размер холста-буффера
        canvas.width  = 3 * size/2; // Ширина буффера
        canvas.height = size/2; // Высота буффера
      
        // Рисуем текстуры
        context.save();
                empty(0, 0);
            context.translate(size/2, 0);
                brick(size/2, 0);
            context.translate(size/2, 0);
                hbrick(size, 0);
        context.restore();
    }