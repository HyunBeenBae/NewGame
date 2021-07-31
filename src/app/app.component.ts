import { createInjectable } from '@angular/compiler/src/core';
import { Component, HostListener, OnInit } from '@angular/core';
import Two from '../assets/two.min.js'
import { AiService } from './services/ai.service.js';
import { CameraService } from './services/camera.service.js';
import { CollisionService } from './services/collision.service.js';
import { MapService } from './services/map.service.js';
import { SpriteService } from './services/sprite.service.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'newgame';

  x: number=200;
  y: number=200;

  max_x: number= 3500;
  max_y: number= 2500;

  constructor(private _spriteService: SpriteService, private _cameraService: CameraService, private _aiService: AiService, private _mapService: MapService, private _collisionService: CollisionService) { }


  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {

if (event.key=='ArrowRight') {
  this.x=this.x+10;
  this._spriteService.sprites[0].direction='right'
}  
else if (event.key=='ArrowLeft') {
  this.x=this.x-10;
  this._spriteService.sprites[0].direction='left'
}  
else if (event.key=='ArrowUp') {
  this.y=this.y-10;
}  
else if (event.key=='ArrowDown') {
  this.y=this.y+10;
}  

}
  ngOnInit () {
    let elem=document.getElementById('draw-shapes');

    let params={
      width: this.max_x+'px',
      height: this.max_y+'px'
    };

    let two = new Two(params).appendTo(elem);

    this._cameraService.init(this.max_x, this.max_y)
    this._spriteService.populateCoin(100);
    this._spriteService.populateGalactaknight(1);
    this._spriteService.populateCloud(10)
    this._spriteService.populateGrass(10)

    this._mapService.init(two);

    

    for (let i=0; i<this._spriteService.sprites.length; i++) {
      this._spriteService.sprites[i].spriteReference = two.makeSprite
    (this. _spriteService.sprites[i].url,
      this. _spriteService.sprites[i].x,
      this. _spriteService.sprites[i].y,
      this. _spriteService.sprites[i].columns,
      this. _spriteService.sprites[i].rows,
      this. _spriteService.sprites[i].fps,
      this. _spriteService.sprites[i].lastDirection);
      this. _spriteService.sprites[i].spriteReference.play(this. _spriteService.sprites[i].rightFrames[0], this. _spriteService.sprites[i].rightFrames[1]);
      this._spriteService.sprites[i].spriteReference.scale=this._spriteService.sprites[i].scale;
    }
    
    two.bind('update', (framesPerSecond)=>{
      if (!this._collisionService.detectBorder(this._spriteService.sprites[0],
        this._spriteService.sprites[0].x,
        this._spriteService.sprites[0].y, this.x, this.y)) {
        this._spriteService.sprites[0].spriteReference.translation.x=this.x;
        this._spriteService.sprites[0].x=this.x;
        this._spriteService.sprites[0].spriteReference.translation.y=this.y;
        this._spriteService.sprites[0].y=this.y;
        this._cameraService.zoomCamera(this.x, this.y);
        }

  
    
      
      for (let i=0; i<this._spriteService.sprites.length; i++) {

        if (i>0) {
          this._spriteService.sprites[i]=this._aiService.basicAI(this._spriteService.sprites[i]);
          this._spriteService.sprites[i].spriteReference.translation.x = this._spriteService.sprites[i].x;
          this._spriteService.sprites[i].spriteReference.translation.y = this._spriteService.sprites[i].y;
          this._spriteService.sprites[i].spriteReference.scale = this._spriteService.sprites[i].scale;
          this._collisionService.detectCollision(this._spriteService.sprites[0], this._spriteService.sprites[i]);
        }

        if (this._spriteService.sprites[i].direction !=this._spriteService.sprites[i].lastDirection) {
          this._spriteService.sprites[i].lastDirection=this._spriteService.sprites[i].direction;
          if (this._spriteService.sprites[i].direction=='right'){
            this._spriteService.sprites[i].spriteReference.play(this._spriteService.sprites[i].rightFrames[0],
              this._spriteService.sprites[i].rightFrames[1])
          }
          else {
            this._spriteService.sprites[i].spriteReference.play(this._spriteService.sprites[i].leftFrames[0],
              this._spriteService.sprites[i].leftFrames[1])
          }
        }
      } 

    }).play();
  }
}
