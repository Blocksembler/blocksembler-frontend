<script setup></script>
<template>
  <div class="container">
    <div class="card my-5">
      <div class="card-header"><h4>Settings</h4></div>
      <div class="card-body">
        <form>
          <div class="row mb-3">
            <label class="col-sm-2 col-form-label" for="inputEmail3"
            >Email</label
            >
            <div class="col-sm-10">
              <input id="inputEmail3" class="form-control" type="email"/>
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-2 col-form-label" for="inputPassword3"
            >Password</label
            >
            <div class="col-sm-10">
              <input id="inputPassword3" class="form-control" type="password"/>
            </div>
          </div>
          <fieldset class="row mb-3">
            <legend class="col-form-label col-sm-2 pt-0">Radios</legend>
            <div class="col-sm-10">
              <div class="form-check">
                <input
                    id="gridRadios1"
                    checked
                    class="form-check-input"
                    name="gridRadios"
                    type="radio"
                    value="option1"
                />
                <label class="form-check-label" for="gridRadios1">
                  First radio
                </label>
              </div>
              <div class="form-check">
                <input
                    id="gridRadios2"
                    class="form-check-input"
                    name="gridRadios"
                    type="radio"
                    value="option2"
                />
                <label class="form-check-label" for="gridRadios2">
                  Second radio
                </label>
              </div>
              <div class="form-check disabled">
                <input
                    id="gridRadios3"
                    class="form-check-input"
                    disabled
                    name="gridRadios"
                    type="radio"
                    value="option3"
                />
                <label class="form-check-label" for="gridRadios3">
                  Third disabled radio
                </label>
              </div>
            </div>
          </fieldset>
          <div class="row mb-3">
            <div class="col-sm-10 offset-sm-2">
              <div class="form-check">
                <input
                    id="gridCheck1"
                    class="form-check-input"
                    type="checkbox"
                />
                <label class="form-check-label" for="gridCheck1">
                  Example checkbox
                </label>
              </div>
            </div>
          </div>
          <button class="btn btn-primary" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  </div>
</template>
