
import {
  MOUSE,
  Quaternion,
  Spherical,
  TOUCH,
  Vector2,
  Vector3
} from 'https://unpkg.com/three@0.160.0/build/three.module.js';

class OrbitControls {
  constructor(object, domElement) {
    this.object = object;
    this.domElement = domElement;
    this.enabled = true;
    this.target = new Vector3();
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.minPolarAngle = 0; 
    this.maxPolarAngle = Math.PI;
    this.minAzimuthAngle = -Infinity; 
    this.maxAzimuthAngle = Infinity; 
    this.enableZoom = true;
    this.zoomSpeed = 1.0;
    this.enableRotate = true;
    this.rotateSpeed = 1.0;
    this.enablePan = true;
    this.panSpeed = 1.0;
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0;
    this.enableDamping = true;
    this.dampingFactor = 0.05;
    // Internals
    const scope = this;
    const spherical = new Spherical();
    const sphericalDelta = new Spherical();

    const rotateStart = new Vector2();
    const rotateEnd = new Vector2();
    const rotateDelta = new Vector2();

    const panOffset = new Vector3();
    let zoomChanged = false;

    const EPS = 0.000001;

    const quat = new Quaternion().setFromUnitVectors(object.up, new Vector3(0, 1, 0));
    const quatInverse = quat.clone().invert();
    this.handleMouseWheel = function (event) {
      if (!scope.enabled || !scope.enableZoom) return;
      let delta = 0;
      if (event.deltaY !== undefined) {
        delta = -event.deltaY;
      }
      sphericalDelta.radius += delta * 0.01 * scope.zoomSpeed;
      zoomChanged = true;
    };
    function onMouseWheel(event) {
      event.preventDefault();
      scope.handleMouseWheel(event);
    }
    this.domElement.addEventListener('wheel', onMouseWheel, { passive: false });

    this.update = function () {
      const offset = new Vector3();
      offset.copy(scope.object.position).sub(scope.target);
      offset.applyQuaternion(quat);

      spherical.setFromVector3(offset);

      if (scope.autoRotate && scope.enableRotate) {
        spherical.theta += (2 * Math.PI / 60 / 60) * scope.autoRotateSpeed;
      }

      spherical.theta += sphericalDelta.theta;
      spherical.phi += sphericalDelta.phi;

      spherical.theta = Math.max(scope.minAzimuthAngle, Math.min(scope.maxAzimuthAngle, spherical.theta));
      spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
      spherical.makeSafe();
      if (zoomChanged) {
        spherical.radius *= 1 + (sphericalDelta.radius * 0.1);
        zoomChanged = false;
      }
      spherical.radius = Math.max(scope.minDistance, Math.min(scope.maxDistance, spherical.radius));

      offset.setFromSpherical(spherical);
      offset.applyQuaternion(quatInverse);

      scope.object.position.copy(scope.target).add(offset);
      scope.object.lookAt(scope.target);

      if (scope.enableDamping) {
        sphericalDelta.theta *= (1 - scope.dampingFactor);
        sphericalDelta.phi *= (1 - scope.dampingFactor);
        sphericalDelta.radius *= (1 - scope.dampingFactor);
      } else {
        sphericalDelta.set(0, 0, 0);
      }
    };

    this.handleMouseMoveRotate = function (event) {
      rotateEnd.set(event.clientX, event.clientY);
      rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

      const element = scope.domElement === document ? scope.domElement.body : scope.domElement;

      sphericalDelta.theta -= 2 * Math.PI * rotateDelta.x / element.clientHeight;
      sphericalDelta.phi -= 2 * Math.PI * rotateDelta.y / element.clientHeight;

      rotateStart.copy(rotateEnd);
    };

    function onMouseDown(event) {
      if (!scope.enabled || !scope.enableRotate) return;

      rotateStart.set(event.clientX, event.clientY);
      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    }

    function onMouseMove(event) {
      scope.handleMouseMoveRotate(event);
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    this.domElement.addEventListener('mousedown', onMouseDown, false);
    this.dispose = function() {
      this.domElement.removeEventListener('mousedown', onMouseDown);
      this.domElement.removeEventListener('wheel', onMouseWheel);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }
}

export { OrbitControls };