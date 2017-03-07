#
# Copyright (C) 2017 Elvis Teixeira
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from django.db import models
import base64, pickle

class PowderSample(models.Model):
    """This model represents a powder crystal sample"""
    nickname = models.CharField(max_length=40)
    standard_name = models.CharField(max_length=80)
    _powder_diffrac = models.TextField(db_column='data', blank=True)

    @property
    def powder_diffrac(self):
        datadic = pickle.loads(base64.decodestring(self._powder_diffrac))
        return datadic['angles'], datadic['intensities']

    @powder_diffrac.setter
    def powder_diffrac(self, angles, intensities):
        datadic = { 'angles': angles, 'intensities': intensities}
        self._powder_diffrac = base64.encodestring(pickle.dumps(datadic))
